import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { appConfig } from '../config/app-config.js';

/**
 * Development mail delivery. Messages go to Mailpit (see docker-compose.yml) and can be read at
 * http://localhost:8025. Swap the transport for a real provider before using this outside training.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport = nodemailer.createTransport({
    host: appConfig.smtpHost,
    port: appConfig.smtpPort,
    secure: false,
  });

  async sendPasswordResetCode(to: string, name: string, code: string) {
    try {
      await this.transport.sendMail({
        from: appConfig.mailFrom,
        to,
        subject: `Your RailPass reset code: ${code}`,
        text: `Hi ${name},\n\nUse this code to reset your RailPass password: ${code}\n\nIt expires in ${appConfig.passwordResetTtlMinutes} minutes. If you did not ask for this, you can ignore this email.`,
        html: `<p>Hi ${escapeHtml(name)},</p><p>Use this code to reset your RailPass password:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>It expires in ${appConfig.passwordResetTtlMinutes} minutes. If you did not ask for this, you can ignore this email.</p>`,
      });
    } catch (error) {
      // The request still succeeds so we never reveal whether the email exists; operators see the log.
      this.logger.error(`Could not send reset email (is Mailpit running?): ${(error as Error).message}`);
    }
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}
