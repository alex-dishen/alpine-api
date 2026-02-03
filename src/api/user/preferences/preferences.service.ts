import { Injectable } from '@nestjs/common';
import { PreferencesRepository } from 'src/api/user/preferences/preferences.repository';
import type {
  UserPreferencesDto,
  UpdatePreferencesDto,
  PreferencesDataDto,
} from 'src/api/user/preferences/dto/preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(private preferencesRepository: PreferencesRepository) {}

  async getPreferences(userId: string): Promise<UserPreferencesDto> {
    const result = await this.preferencesRepository.findByUserId(userId);

    if (!result) {
      return { preferences: {} };
    }

    // Cast the JSON preferences to our typed structure
    return { preferences: result.preferences as PreferencesDataDto };
  }

  async updatePreferences(userId: string, data: UpdatePreferencesDto): Promise<void> {
    await this.preferencesRepository.upsert(userId, data);
  }
}
