import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/db/db.service';
import type { UserPreferencesGetOutput, UserPreferencesUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class PreferencesRepository {
  constructor(private kysely: DatabaseService) {}

  async findByUserId(userId: string): Promise<UserPreferencesGetOutput | undefined> {
    return this.kysely.db.selectFrom('user_preferences').where('user_id', '=', userId).selectAll().executeTakeFirst();
  }

  async upsert(userId: string, data: UserPreferencesUpdateInput): Promise<void> {
    await this.kysely.db
      .insertInto('user_preferences')
      .values({ user_id: userId, ...data })
      .onConflict(oc =>
        oc.column('user_id').doUpdateSet({
          ...data,
          updated_at: new Date(),
        }),
      )
      .execute();
  }
}
