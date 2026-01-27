import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { Match } from './match.decorator';

class TestDto {
  password: string;

  @Match<TestDto>('password', { message: 'Passwords must match' })
  confirmPassword: string;
}

describe('Match decorator', () => {
  it('should pass validation when fields match', async () => {
    const dto = new TestDto();
    dto.password = 'SecurePass123!';
    dto.confirmPassword = 'SecurePass123!';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when fields do not match', async () => {
    const dto = new TestDto();
    dto.password = 'SecurePass123!';
    dto.confirmPassword = 'DifferentPass456!';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('confirmPassword');
    expect(errors[0].constraints?.Match).toBe('Passwords must match');
  });

  it('should fail validation when confirm field is empty', async () => {
    const dto = new TestDto();
    dto.password = 'SecurePass123!';
    dto.confirmPassword = '';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should pass validation when both fields are empty', async () => {
    const dto = new TestDto();
    dto.password = '';
    dto.confirmPassword = '';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle undefined values', async () => {
    const dto = new TestDto();
    dto.password = undefined as unknown as string;
    dto.confirmPassword = undefined as unknown as string;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when password is undefined but confirm is set', async () => {
    const dto = new TestDto();
    dto.password = undefined as unknown as string;
    dto.confirmPassword = 'SomePassword';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });
});
