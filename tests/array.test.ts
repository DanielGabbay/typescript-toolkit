import { describe, it, expect } from 'vitest';
import { 
  chunk, unique, uniqueBy, groupBy, flatten, partition,
  union, intersection, difference, sum, mean, median,
  binarySearch, sortBy, flattenDepth, zip
} from '../src/array';

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

  describe('set operations', () => {
    describe('union', () => {
      it('should return union of arrays', () => {
        expect(union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4]);
      });
    });

    describe('intersection', () => {
      it('should return intersection of arrays', () => {
        expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
      });
    });

    describe('difference', () => {
      it('should return elements in first but not in others', () => {
        expect(difference([1, 2, 3, 4], [2], [4])).toEqual([1, 3]);
      });
    });
  });

  describe('statistics', () => {
    describe('sum', () => {
      it('should calculate sum of numbers', () => {
        expect(sum([1, 2, 3, 4, 5])).toBe(15);
        expect(sum([])).toBe(0);
      });
    });

    describe('mean', () => {
      it('should calculate average', () => {
        expect(mean([2, 4, 6])).toBe(4);
        expect(mean([])).toBeNaN();
      });
    });

    describe('median', () => {
      it('should calculate median for odd length', () => {
        expect(median([1, 3, 5])).toBe(3);
      });

      it('should calculate median for even length', () => {
        expect(median([1, 2, 3, 4])).toBe(2.5);
      });
    });
  });

  describe('search and sort', () => {
    describe('binarySearch', () => {
      it('should find element in sorted array', () => {
        expect(binarySearch([1, 3, 5, 7, 9], 5)).toBe(2);
        expect(binarySearch([1, 3, 5, 7, 9], 6)).toBe(-1);
      });
    });

    describe('sortBy', () => {
      it('should sort by key functions', () => {
        const people = [{ name: 'John', age: 30 }, { name: 'Alice', age: 25 }];
        const sorted = sortBy(people, p => p.age);
        expect(sorted[0].name).toBe('Alice');
      });
    });
  });

  describe('advanced operations', () => {
    describe('zip', () => {
      it('should zip arrays together', () => {
        expect(zip([1, 2], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']]);
      });
    });

    describe('flattenDepth', () => {
      it('should flatten to specified depth', () => {
        expect(flattenDepth([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
      });
    });
  });
});