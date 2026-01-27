import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import IsNullOrNumberDecorator from './is-number-or-null.decorator';

class TestDto {
  @IsNullOrNumberDecorator({ message: 'Value must be null or an integer' })
  value: unknown;
}

describe('IsNullOrNumberDecorator', () => {
  describe('valid values', () => {
    it('should accept null value', async () => {
      const dto = new TestDto();
      dto.value = null;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept string "null"', async () => {
      const dto = new TestDto();
      dto.value = 'null';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept positive integers', async () => {
      const dto = new TestDto();
      dto.value = 42;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept zero', async () => {
      const dto = new TestDto();
      dto.value = 0;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept negative integers', async () => {
      const dto = new TestDto();
      dto.value = -10;

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('invalid values', () => {
    it('should reject floating point numbers', async () => {
      const dto = new TestDto();
      dto.value = 3.14;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
      expect(errors[0].property).toBe('value');
    });

    it('should reject strings (except "null")', async () => {
      const dto = new TestDto();
      dto.value = 'hello';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject numeric strings', async () => {
      const dto = new TestDto();
      dto.value = '42';

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject undefined', async () => {
      const dto = new TestDto();
      dto.value = undefined;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject boolean values', async () => {
      const dto = new TestDto();
      dto.value = true;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject objects', async () => {
      const dto = new TestDto();
      dto.value = { num: 42 };

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject arrays', async () => {
      const dto = new TestDto();
      dto.value = [1, 2, 3];

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject NaN', async () => {
      const dto = new TestDto();
      dto.value = NaN;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });

    it('should reject Infinity', async () => {
      const dto = new TestDto();
      dto.value = Infinity;

      const errors = await validate(dto);
      expect(errors.length).toBe(1);
    });
  });
});
