import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../db.service';
import { Propagation, TransactionOptions } from './transaction.types';
import { TransactionStorage } from './transaction-storage';

@Injectable()
export class TransactionManager {
  constructor(private readonly kysely: DatabaseService) {}

  async run<T>(callback: () => Promise<T>, options: TransactionOptions = {}): Promise<T> {
    const { propagation = Propagation.REQUIRED, isolationLevel } = options;
    const currentTx = TransactionStorage.getStore();

    // If already in a transaction
    if (propagation === Propagation.REQUIRED && currentTx) {
      return callback();
    }

    const transactionBuilder = this.kysely.db.transaction();

    if (isolationLevel) {
      transactionBuilder.setIsolationLevel(isolationLevel);
    }

    return transactionBuilder.execute(kyselyTx => {
      // Start a new ALS context with the transactional kyselyTx object.
      // Under the hood: take the first argument from the function and put it in our storage.
      // Now our storage holds the transaction for the duration of the app request.
      return TransactionStorage.run(kyselyTx, callback);
    });
  }
}
