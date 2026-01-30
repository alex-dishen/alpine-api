import { Module } from '@nestjs/common';
import { UsersService } from 'src/api/user/users/users.service';
import { UsersController } from 'src/api/user/users/users.controller';
import { UsersRepository } from 'src/api/user/users/users.repository';
import { PreferencesController } from 'src/api/user/preferences/preferences.controller';
import { PreferencesService } from 'src/api/user/preferences/preferences.service';
import { PreferencesRepository } from 'src/api/user/preferences/preferences.repository';

@Module({
  imports: [],
  controllers: [UsersController, PreferencesController],
  providers: [UsersRepository, UsersService, PreferencesRepository, PreferencesService],
  exports: [UsersRepository],
})
export class UserModule {}
