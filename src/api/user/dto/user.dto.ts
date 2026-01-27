import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Match } from 'src/shared/decorators/match/match.decorator';
import { IsEmail, IsString, IsOptional, IsStrongPassword, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @Exclude()
  @ApiHideProperty()
  password?: string | null;

  created_at: Date;
  updated_at: Date;
  last_name: string;
  first_name: string;
  avatar: string | null;
}

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match<CreateUserDto>('password', { message: 'Passwords do not match' })
  confirmation_password: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @Match<UpdateUserDto>('password', { message: 'Passwords do not match' })
  confirmation_password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
