import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/api/user/users/users.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { UpdateUserDto, UserDto } from 'src/api/user/users/dto/users.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, NotFoundException, Put, UseGuards } from '@nestjs/common';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @Get('/current')
  async getCurrentUser(@GetUser('sub') userId: string): Promise<UserDto> {
    const user = await this.userService.getUser(userId);

    if (!user) throw new NotFoundException();

    return plainToInstance(UserDto, user);
  }

  @ApiOperation({ summary: 'Update current user' })
  @Put('/current')
  updateCurrentUser(@GetUser('sub') userId: string, @Body() data: UpdateUserDto): Promise<MessageDto> {
    return this.userService.updateUser(userId, data);
  }
}
