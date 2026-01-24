import { Module } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { UserController } from 'src/api/user/user.controller';
import { UserRepository } from 'src/api/user/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
