import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { PreferencesService } from 'src/api/user/preferences/preferences.service';
import { UserPreferencesDto, UpdatePreferencesDto } from 'src/api/user/preferences/dto/preferences.dto';

@ApiTags('User Preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @ApiOperation({ summary: 'Get user preferences' })
  @ApiOkResponse({ type: UserPreferencesDto })
  @Get('current/preferences')
  getPreferences(@GetUser('sub') userId: string): Promise<UserPreferencesDto> {
    return this.preferencesService.getPreferences(userId);
  }

  @ApiOperation({ summary: 'Update user preferences' })
  @ApiOkResponse({ type: MessageDto })
  @Put('current/preferences')
  async updatePreferences(@GetUser('sub') userId: string, @Body() data: UpdatePreferencesDto): Promise<MessageDto> {
    await this.preferencesService.updatePreferences(userId, data);

    return { message: 'Preferences updated successfully' };
  }
}
