import { describe, it, expect } from 'vitest';
import { Pagination } from './pagination.helper';
import { Base64 } from 'src/shared/utils/base64/base64';

describe('Pagination', () => {
  describe('generateOffsetMeta', () => {
    it('should calculate metadata for first page', () => {
      const meta = Pagination.generateOffsetMeta(10, 0, 100);

      expect(meta).toEqual({
        total: 100,
        lastPage: 10,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: 10,
      });
    });

    it('should calculate metadata for middle page', () => {
      const meta = Pagination.generateOffsetMeta(10, 20, 100);

      expect(meta).toEqual({
        total: 100,
        lastPage: 10,
        currentPage: 3,
        perPage: 10,
        prev: 20,
        next: 30,
      });
    });

    it('should calculate metadata for last page', () => {
      const meta = Pagination.generateOffsetMeta(10, 90, 100);

      expect(meta).toEqual({
        total: 100,
        lastPage: 10,
        currentPage: 10,
        perPage: 10,
        prev: 90,
        next: null,
      });
    });

    it('should handle single page result', () => {
      const meta = Pagination.generateOffsetMeta(10, 0, 5);

      expect(meta).toEqual({
        total: 5,
        lastPage: 1,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      });
    });

    it('should handle empty result', () => {
      const meta = Pagination.generateOffsetMeta(10, 0, 0);

      expect(meta).toEqual({
        total: 0,
        lastPage: 0,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      });
    });

    it('should handle exact page boundary', () => {
      const meta = Pagination.generateOffsetMeta(10, 0, 10);

      expect(meta).toEqual({
        total: 10,
        lastPage: 1,
        currentPage: 1,
        perPage: 10,
        prev: null,
        next: null,
      });
    });

    it('should handle different page sizes', () => {
      const meta = Pagination.generateOffsetMeta(25, 50, 200);

      expect(meta).toEqual({
        total: 200,
        lastPage: 8,
        currentPage: 3,
        perPage: 25,
        prev: 50,
        next: 75,
      });
    });

    it('should handle skip not aligned to page size', () => {
      const meta = Pagination.generateOffsetMeta(10, 15, 100);

      expect(meta.currentPage).toBe(3);
    });
  });

  describe('cursor encoding/decoding', () => {
    it('should encode cursor data as base64 JSON', () => {
      const cursorData = { id: 'abc-123', createdAt: '2024-01-01T00:00:00Z' };
      const encoded = Base64.encode(JSON.stringify(cursorData));
      const decoded = JSON.parse(Base64.decode(encoded));

      expect(decoded).toEqual(cursorData);
    });

    it('should handle null values in cursor', () => {
      const cursorData = { id: 'abc-123', score: null };
      const encoded = Base64.encode(JSON.stringify(cursorData));
      const decoded = JSON.parse(Base64.decode(encoded));

      expect(decoded).toEqual(cursorData);
      expect(decoded.score).toBeNull();
    });

    it('should handle numeric values in cursor', () => {
      const cursorData = { id: 123, priority: 5.5 };
      const encoded = Base64.encode(JSON.stringify(cursorData));
      const decoded = JSON.parse(Base64.decode(encoded));

      expect(decoded).toEqual(cursorData);
    });

    it('should handle multiple fields in cursor', () => {
      const cursorData = {
        createdAt: '2024-01-01T00:00:00Z',
        id: 'abc-123',
        status: 'active',
      };
      const encoded = Base64.encode(JSON.stringify(cursorData));
      const decoded = JSON.parse(Base64.decode(encoded));

      expect(decoded).toEqual(cursorData);
    });
  });
});
