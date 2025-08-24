import { describe, it, expect } from 'vitest';
import {
  deepMerge,
  deepClone,
  deepEqual,
  deepFreeze
} from './deep-operations';

describe('deep operations utilities', () => {
  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const obj1 = { a: 1, b: { x: 1, y: 2 } };
      const obj2 = { b: { y: 3, z: 4 }, c: 5 };
      
      const result = deepMerge(obj1 as any, obj2 as any);
      
      expect(result).toEqual({
        a: 1,
        b: { x: 1, y: 3, z: 4 },
        c: 5
      });
    });

    it('should handle multiple objects', () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      
      const result = deepMerge(obj1 as any, obj2 as any, obj3 as any);
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle null and undefined objects', () => {
      const obj1 = { a: 1 };
      const result = deepMerge(obj1 as any, null as any, undefined as any, { b: 2 } as any);
      
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle arrays by overwriting', () => {
      const obj1 = { arr: [1, 2] };
      const obj2 = { arr: [3, 4] };
      
      const result = deepMerge(obj1, obj2);
      
      expect(result.arr).toEqual([3, 4]);
    });

    it('should handle nested objects', () => {
      const obj1 = { nested: { deep: { value: 1 } } };
      const obj2 = { nested: { deep: { other: 2 } } };
      
      const result = deepMerge(obj1 as any, obj2 as any);
      
      expect(result).toEqual({
        nested: { deep: { value: 1, other: 2 } }
      });
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2, d: [3, 4] } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });

    it('should clone arrays', () => {
      const arr = [1, { a: 2 }, [3, 4]];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone dates', () => {
      const date = new Date('2023-01-01');
      const cloned = deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned instanceof Date).toBe(true);
    });

    it('should clone regex objects', () => {
      const regex = /test/gi;
      const cloned = deepClone(regex);
      
      expect(cloned.source).toBe(regex.source);
      expect(cloned.flags).toBe(regex.flags);
      expect(cloned).not.toBe(regex);
    });

    it('should clone Sets', () => {
      const set = new Set([1, { a: 2 }, 3]);
      const cloned = deepClone(set);
      
      expect(cloned).not.toBe(set);
      expect(cloned.size).toBe(set.size);
      expect(cloned.has(1)).toBe(true);
      expect(cloned.has(3)).toBe(true);
    });

    it('should clone Maps', () => {
      const map = new Map<any, any>([
        ['key1', { value: 1 }],
        [{ key: 2 }, 'value2']
      ]);
      const cloned = deepClone(map);
      
      expect(cloned).not.toBe(map);
      expect(cloned.size).toBe(map.size);
    });
  });

  describe('deepEqual', () => {
    it('should return true for identical primitives', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual('hello', 'hello')).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual('hello', 'world')).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
    });

    it('should compare objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      const obj3 = { a: 1, b: { c: 3 } };
      
      expect(deepEqual(obj1, obj2)).toBe(true);
      expect(deepEqual(obj1, obj3)).toBe(false);
    });

    it('should compare arrays', () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
    });

    it('should handle nested arrays and objects', () => {
      const a = [{ x: 1 }, { y: [2, 3] }];
      const b = [{ x: 1 }, { y: [2, 3] }];
      const c = [{ x: 1 }, { y: [2, 4] }];
      
      expect(deepEqual(a, b)).toBe(true);
      expect(deepEqual(a, c)).toBe(false);
    });

    it('should compare dates', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');
      
      expect(deepEqual(date1, date2)).toBe(true);
      expect(deepEqual(date1, date3)).toBe(false);
    });

    it('should compare regex objects', () => {
      const regex1 = /test/gi;
      const regex2 = /test/gi;
      const regex3 = /test/g;
      
      expect(deepEqual(regex1, regex2)).toBe(true);
      expect(deepEqual(regex1, regex3)).toBe(false);
    });

    it('should compare Sets', () => {
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      const set3 = new Set([1, 2, 4]);
      
      expect(deepEqual(set1, set2)).toBe(true);
      expect(deepEqual(set1, set3)).toBe(false);
    });

    it('should compare Maps', () => {
      const map1 = new Map([['a', 1], ['b', 2]]);
      const map2 = new Map([['a', 1], ['b', 2]]);
      const map3 = new Map([['a', 1], ['b', 3]]);
      
      expect(deepEqual(map1, map2)).toBe(true);
      expect(deepEqual(map1, map3)).toBe(false);
    });

    it('should handle mixed types', () => {
      expect(deepEqual({}, [])).toBe(false);
      expect(deepEqual([], {})).toBe(false);
      expect(deepEqual(new Date(), {})).toBe(false);
      expect(deepEqual({}, new Date())).toBe(false);
    });
  });

  describe('deepFreeze', () => {
    it('should freeze primitive values', () => {
      expect(deepFreeze(42)).toBe(42);
      expect(deepFreeze('hello')).toBe('hello');
      expect(deepFreeze(null)).toBe(null);
    });

    it('should freeze objects deeply', () => {
      const obj = { a: 1, b: { c: 2, d: [3, 4] } };
      const frozen = deepFreeze(obj);
      
      expect(frozen).toBe(obj);
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.b)).toBe(true);
      expect(Object.isFrozen(frozen.b.d)).toBe(true);
    });

    it('should prevent modifications', () => {
      const obj = { a: 1, b: { c: 2 } };
      const frozen = deepFreeze(obj);
      
      expect(() => {
        (frozen as any).a = 99;
      }).toThrow();
      
      expect(() => {
        (frozen.b as any).c = 99;
      }).toThrow();
    });

    it('should handle arrays', () => {
      const arr = [1, { a: 2 }];
      const frozen = deepFreeze(arr);
      
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen[1])).toBe(true);
    });
  });
});
