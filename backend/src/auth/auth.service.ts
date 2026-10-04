import { BadRequestException, ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomInt } from 'node:crypto';

import { appConfig } from '../config/app-config.js';
import { MailService } from '../mail/mail.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { toUserDto } from '../users/user.mapper.js';
import { hashPassword, verifyPassword } from './password.js';
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto.js';

const hashCode = (code: string) => createHash('sha256').update(code).digest('hex');

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_IN_USE',
        message: 'An account with this email already exists.',
        details: { fieldErrors: { email: 'An account with this email already exists.' } },
      });
    }
    const user = await this.prisma.user.create({
      data: { email: dto.email, fullName: dto.fullName, passwordHash: await hashPassword(dto.password) },
    });
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Same message for unknown email and wrong password, so accounts cannot be enumerated.
    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' });
    }
    return this.session(user);
  }

  /** Always resolves, whether or not the email exists. */
  async requestPasswordReset(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return;

    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          codeHash: hashCode(code),
          expiresAt: new Date(Date.now() + appConfig.passwordResetTtlMinutes * 60_000),
        },
      }),
    ]);

    if (appConfig.logResetCodes) {
      this.logger.warn(`[development] Password reset code for ${user.email}: ${code}`);
    }
    await this.mail.sendPasswordResetCode(user.email, user.fullName, code);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const invalid = new BadRequestException({
      code: 'INVALID_RESET_CODE',
      message: 'That code is invalid or has expired. Request a new one.',
      details: { fieldErrors: { code: 'That code is invalid or has expired.' } },
    });
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw invalid;

    const token = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!token || token.attempts >= appConfig.passwordResetMaxAttempts) throw invalid;

    if (token.codeHash !== hashCode(dto.code)) {
      await this.prisma.passwordResetToken.update({ where: { id: token.id }, data: { attempts: { increment: 1 } } });
      throw invalid;
    }

    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(dto.password) } }),
      this.prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    ]);
  }

  private async session(user: Parameters<typeof toUserDto>[0]) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return { accessToken, user: toUserDto(user) };
  }
}
