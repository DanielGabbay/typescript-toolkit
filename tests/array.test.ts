import { describe, it, expect } from 'vitest';
import { chunk, unique, uniqueBy, groupBy, flatten, partition } from '../src/array';

describe('array utilities', () => {
  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should throw error for invalid chunk size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be greater than 0');
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key function', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
      expect(uniqueBy(items, item => item.id)).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe('groupBy', () => {
    it('should group items by key function', () => {
      const items = [{ type: 'a', value: 1 }, { type: 'b', value: 2 }, { type: 'a', value: 3 }];
      expect(groupBy(items, item => item.type)).toEqual({
        a: [{ type: 'a', value: 1 }, { type: 'a', value: 3 }],
        b: [{ type: 'b', value: 2 }]
      });
    });
  });

  describe('flatten', () => {
    it('should flatten one level deep', () => {
      expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
    });
  });

  describe('partition', () => {
    it('should split array based on predicate', () => {
      expect(partition([1, 2, 3, 4], x => x % 2 === 0)).toEqual([[2, 4], [1, 3]]);
    });
  });
});