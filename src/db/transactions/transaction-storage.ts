import { AsyncLocalStorage } from 'async_hooks';
import { Kysely } from 'kysely';
import { DB } from '../types/db.types';

export const TransactionStorage = new AsyncLocalStorage<Kysely<DB>>();
