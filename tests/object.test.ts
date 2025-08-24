import { describe, it, expect } from 'vitest';
import { 
  deepClone, deepMerge, pick, omit, get, set, mapKeys, mapValues, invert 
} from '../src/object';

describe('object utilities', () => {
  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(null)).toBe(null);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2, d: [3, 4] } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });

    it('should clone dates', () => {
      const date = new Date('2023-01-01');
      const cloned = deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const target = { a: 1, b: { x: 1, y: 2 } };
      const source = { b: { y: 3, z: 4 }, c: 5 };
      
      const result = deepMerge(target, source);
      
      expect(result).toEqual({
        a: 1,
        b: { x: 1, y: 3, z: 4 },
        c: 5
      });
    });

    it('should handle multiple sources', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };
      
      const result = deepMerge(target, source1, source2);
      
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('pick', () => {
    it('should pick specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = pick(obj, 'a', 'c');
      
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should ignore non-existent properties', () => {
      const obj = { a: 1, b: 2 };
      const result = pick(obj, 'a', 'x' as keyof typeof obj);
      
      expect(result).toEqual({ a: 1 });
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = omit(obj, 'b', 'd');
      
      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('get', () => {
    it('should get nested property by path', () => {
      const obj = { a: { b: { c: 42 } } };
      
      expect(get(obj, 'a.b.c')).toBe(42);
      expect(get(obj, 'a.b')).toEqual({ c: 42 });
    });

    it('should return default value for missing path', () => {
      const obj = { a: { b: 1 } };
      
      expect(get(obj, 'a.x.y', 'default')).toBe('default');
      expect(get(obj, 'x', 'default')).toBe('default');
    });

    it('should handle null/undefined objects', () => {
      expect(get(null, 'a.b', 'default')).toBe('default');
      expect(get(undefined, 'a.b', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested property by path', () => {
      const obj: any = { a: { b: 1 } };
      set(obj, 'a.b.c', 42);
      
      expect(obj.a.b.c).toBe(42);
    });

    it('should create missing intermediate objects', () => {
      const obj: any = {};
      set(obj, 'a.b.c', 42);
      
      expect(obj).toEqual({ a: { b: { c: 42 } } });
    });

    it('should handle root level properties', () => {
      const obj: any = {};
      set(obj, 'x', 42);
      
      expect(obj.x).toBe(42);
    });
  });

  describe('mapKeys', () => {
    it('should transform object keys', () => {
      const obj = { firstName: 'John', lastName: 'Doe' };
      const result = mapKeys(obj, (key) => key.toUpperCase());
      
      expect(result).toEqual({ FIRSTNAME: 'John', LASTNAME: 'Doe' });
    });
  });

  describe('mapValues', () => {
    it('should transform object values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, (value) => value * 2);
      
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should pass key to transform function', () => {
      const obj = { first: 'john', last: 'doe' };
      const result = mapValues(obj, (value, key) => `${key}:${value}`);
      
      expect(result).toEqual({ first: 'first:john', last: 'last:doe' });
    });
  });

  describe('invert', () => {
    it('should swap keys and values', () => {
      const obj = { a: '1', b: '2', c: '3' };
      const result = invert(obj);
      
      expect(result).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
    });
  });
});