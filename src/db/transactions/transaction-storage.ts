import { AsyncLocalStorage } from 'async_hooks';
import type { Kysely } from 'kysely';
import type { DB } from '../types/db.types';

export const TransactionStorage = new AsyncLocalStorage<Kysely<DB>>();
