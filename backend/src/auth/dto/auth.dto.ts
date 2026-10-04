import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

const trimLower = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters and include a letter and a number.';

class PasswordField {
  @IsString()
  @MinLength(8, { message: PASSWORD_RULE_MESSAGE })
  @MaxLength(72)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: PASSWORD_RULE_MESSAGE })
  password!: string;
}

export class RegisterDto extends PasswordField {
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'Please enter your full name.' })
  fullName!: string;

  @Transform(trimLower)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;
}

export class LoginDto {
  @Transform(trimLower)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Please enter your password.' })
  password!: string;
}

export class ForgotPasswordDto {
  @Transform(trimLower)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;
}

export class ResetPasswordDto extends PasswordField {
  @Transform(trimLower)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email!: string;

  @Transform(trim)
  @Matches(/^\d{6}$/, { message: 'Enter the 6-digit code from the email.' })
  code!: string;
}
