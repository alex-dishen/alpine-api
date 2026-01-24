/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';

export function Transaction(): MethodDecorator {
  const injectManager = Inject(TransactionManager);

  //@ts-ignore
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    injectManager(target, 'kyselyTransactionalManager');
    descriptor.value = function (...args: any[]) {
      //@ts-ignore
      const manager: KyselyTransactionalManager = this.kyselyTransactionalManager;

      if (!manager) throw new Error('KyselyTransactionalManager is not available.');

      // Set the context with our transactional manager
      // The callback will be executed inside the transactional context
      return manager.run(() => originalMethod.apply(this, args));
    };
  };
}
