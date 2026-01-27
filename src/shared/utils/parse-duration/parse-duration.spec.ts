import { describe, it, expect } from 'vitest';
import { parseDuration } from './parse-duration';

describe('parseDuration', () => {
  describe('valid formats', () => {
    it('should parse milliseconds', () => {
      expect(parseDuration('500ms', 'ms')).toBe(500);
      expect(parseDuration('1000ms', 's')).toBe(1);
    });

    it('should parse seconds', () => {
      expect(parseDuration('30s', 's')).toBe(30);
      expect(parseDuration('60s', 'm')).toBe(1);
      expect(parseDuration('1s', 'ms')).toBe(1000);
    });

    it('should parse minutes', () => {
      expect(parseDuration('5m', 'm')).toBe(5);
      expect(parseDuration('60m', 'h')).toBe(1);
      expect(parseDuration('1m', 's')).toBe(60);
      expect(parseDuration('1m', 'ms')).toBe(60000);
    });

    it('should parse hours', () => {
      expect(parseDuration('2h', 'h')).toBe(2);
      expect(parseDuration('24h', 'd')).toBe(1);
      expect(parseDuration('1h', 'm')).toBe(60);
      expect(parseDuration('1h', 's')).toBe(3600);
      expect(parseDuration('1h', 'ms')).toBe(3600000);
    });

    it('should parse days', () => {
      expect(parseDuration('7d', 'd')).toBe(7);
      expect(parseDuration('1d', 'h')).toBe(24);
      expect(parseDuration('1d', 'm')).toBe(1440);
      expect(parseDuration('1d', 's')).toBe(86400);
      expect(parseDuration('1d', 'ms')).toBe(86400000);
    });
  });

  describe('edge cases', () => {
    it('should handle zero values', () => {
      expect(parseDuration('0s', 'ms')).toBe(0);
      expect(parseDuration('0h', 'd')).toBe(0);
    });

    it('should handle large values', () => {
      expect(parseDuration('365d', 'd')).toBe(365);
      expect(parseDuration('999999ms', 'ms')).toBe(999999);
    });

    it('should handle fractional results', () => {
      expect(parseDuration('30m', 'h')).toBe(0.5);
      expect(parseDuration('90s', 'm')).toBe(1.5);
    });
  });

  describe('invalid formats', () => {
    it('should throw for missing unit', () => {
      expect(() => parseDuration('100', 'ms')).toThrow('Invalid duration format');
    });

    it('should throw for invalid unit', () => {
      expect(() => parseDuration('10x', 'ms')).toThrow('Invalid duration format');
      expect(() => parseDuration('10sec', 'ms')).toThrow('Invalid duration format');
    });

    it('should throw for negative values', () => {
      expect(() => parseDuration('-5s', 'ms')).toThrow('Invalid duration format');
    });

    it('should throw for decimal values', () => {
      expect(() => parseDuration('1.5h', 'ms')).toThrow('Invalid duration format');
    });

    it('should throw for empty string', () => {
      expect(() => parseDuration('', 'ms')).toThrow('Invalid duration format');
    });

    it('should throw for whitespace', () => {
      expect(() => parseDuration(' 5s', 'ms')).toThrow('Invalid duration format');
      expect(() => parseDuration('5s ', 'ms')).toThrow('Invalid duration format');
    });
  });
});
