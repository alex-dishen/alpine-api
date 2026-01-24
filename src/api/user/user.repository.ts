import { DatabaseService } from 'src/db/db.service';
import { Injectable } from '@nestjs/common';
import { UserCreateInput, UserGetOutput, UserUpdateInput } from 'src/db/types/db.types';

@Injectable()
export class UserRepository {
  constructor(private kysely: DatabaseService) {}

  async createUser(data: UserCreateInput): Promise<UserGetOutput> {
    return this.kysely.db.insertInto('users').values(data).returningAll().executeTakeFirstOrThrow();
  }

  async getUserBy(where: Partial<UserGetOutput>): Promise<UserGetOutput | undefined> {
    let qb = this.kysely.db.selectFrom('users');

    for (const [key, value] of Object.entries(where)) {
      qb = qb.where(key as keyof UserGetOutput, '=', value);
    }

    return qb.selectAll().executeTakeFirst();
  }

  async updateUser(userId: string, data: UserUpdateInput): Promise<void> {
    await this.kysely.db.updateTable('users').set(data).where('id', '=', userId).execute();
  }
}
