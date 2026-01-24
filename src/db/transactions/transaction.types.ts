import type { IsolationLevel } from 'kysely';

export enum Propagation {
  // If a transaction already exists, use it. If not, create a new one. (Default)
  REQUIRED = 'REQUIRED',

  // Always creates a new, independent transaction. If an outer transaction exists, it will be "suspended" while the new one executes.
  REQUIRES_NEW = 'REQUIRES_NEW',
}

export type TransactionOptions = {
  propagation?: Propagation;
  isolationLevel?: IsolationLevel;
};
