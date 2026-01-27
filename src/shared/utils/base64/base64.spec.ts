import { describe, it, expect } from 'vitest';
import { Base64 } from './base64';

describe('Base64', () => {
  describe('encode', () => {
    it('should encode a simple string', () => {
      expect(Base64.encode('hello')).toBe('aGVsbG8=');
    });

    it('should encode an empty string', () => {
      expect(Base64.encode('')).toBe('');
    });

    it('should encode unicode characters', () => {
      const encoded = Base64.encode('привет');
      expect(encoded).toBe('0L/RgNC40LLQtdGC');
    });

    it('should encode special characters', () => {
      const encoded = Base64.encode('hello!@#$%^&*()');
      expect(Base64.decode(encoded)).toBe('hello!@#$%^&*()');
    });

    it('should encode JSON strings', () => {
      const json = JSON.stringify({ id: 123, name: 'test' });
      const encoded = Base64.encode(json);
      expect(Base64.decode(encoded)).toBe(json);
    });
  });

  describe('decode', () => {
    it('should decode a simple string', () => {
      expect(Base64.decode('aGVsbG8=')).toBe('hello');
    });

    it('should decode an empty string', () => {
      expect(Base64.decode('')).toBe('');
    });

    it('should decode unicode characters', () => {
      expect(Base64.decode('0L/RgNC40LLQtdGC')).toBe('привет');
    });
  });

  describe('round-trip', () => {
    it('should encode and decode back to original', () => {
      const original = 'The quick brown fox jumps over the lazy dog';
      expect(Base64.decode(Base64.encode(original))).toBe(original);
    });

    it('should handle complex cursor data', () => {
      const cursorData = { id: 'abc-123', createdAt: '2024-01-01T00:00:00Z', score: null };
      const json = JSON.stringify(cursorData);
      const encoded = Base64.encode(json);
      const decoded = JSON.parse(Base64.decode(encoded));
      expect(decoded).toEqual(cursorData);
    });
  });
});
