import { Pool, types } from 'pg';
import { DB } from './types/db.types';
import { Kysely, PostgresDialect } from 'kysely';
import { Injectable } from '@nestjs/common';
import { TransactionStorage } from './transactions/transaction-storage';

// Return timestamps as strings to avoid JavaScript Date timezone conversion issues
// 1114 = timestamp without timezone, 1184 = timestamp with timezone
types.setTypeParser(1114, (val: string) => val);
types.setTypeParser(1184, (val: string) => val);

@Injectable()
export class DatabaseService {
  private readonly dbConnection: Kysely<DB>;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.dbConnection = new Kysely<DB>({
      dialect: new PostgresDialect({ pool }),
      // log: ['query'],
    });
  }

  get db(): Kysely<DB> {
    const tx = TransactionStorage.getStore();

    return tx || this.dbConnection;
  }
}
