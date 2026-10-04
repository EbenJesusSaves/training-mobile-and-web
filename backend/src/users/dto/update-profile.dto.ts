import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

import { PASSWORD_RULE_MESSAGE } from '../../auth/dto/auth.dto.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class UpdateProfileDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'Please enter your full name.' })
  fullName?: string;

  @IsOptional()
  @Transform(trim)
  @Matches(/^$|^\+?[0-9 ]{7,16}$/, { message: 'Enter a valid phone number, e.g. +233 24 123 4567.' })
  phone?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Enter your current password.' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: PASSWORD_RULE_MESSAGE })
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: PASSWORD_RULE_MESSAGE })
  newPassword!: string;
}
