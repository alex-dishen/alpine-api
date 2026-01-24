import { OmitType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsJWT, IsString, IsStrongPassword } from 'class-validator';
import { UserProvider } from 'src/db/types/db.types';
import { Match } from 'src/shared/decorators/match.decorator';

export class SingInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class OAuthSignInDto {
  @IsString()
  code: string;

  @IsEnum(UserProvider)
  provider: UserProvider;
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
