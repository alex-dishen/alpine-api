import { DatabaseService } from './db.service';
import { Global, Module } from '@nestjs/common';
import { TransactionManager } from './transactions/transaction-manager';

@Global()
@Module({
  providers: [DatabaseService, TransactionManager],
  exports: [DatabaseService, TransactionManager],
})
export class DatabaseModule {}
