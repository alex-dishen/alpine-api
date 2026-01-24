import type { ValidationOptions } from 'class-validator';
import { isInt, registerDecorator } from 'class-validator';

export default function IsNullOrNumberDecorator(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: String(propertyName),
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: unknown) {
          return value === 'null' || value === null || isInt(value);
        },
      },
    });
  };
}
