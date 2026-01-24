import { Pool } from 'pg';
import { DB } from './types/db.types';
import { Kysely, PostgresDialect } from 'kysely';
import { Injectable } from '@nestjs/common';
import { TransactionStorage } from './transactions/transaction-storage';

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
