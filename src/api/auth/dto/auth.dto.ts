import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsString, IsStrongPassword } from 'class-validator';
import { Match } from 'src/shared/decorators/match.decorator';

export class SingInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignUpDto {
  @IsString()
  first_name: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match<SignUpDto>('password', { message: 'Passwords do not match' })
  confirmation_password: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;
}

export class AuthDto {
  @IsJWT()
  access_token: string;

  @IsJWT()
  refresh_token: string;
}

export class AccessTokenDto extends OmitType(AuthDto, ['refresh_token']) {}
