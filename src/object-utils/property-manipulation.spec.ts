import {
  pick,
  omit,
  pluck,
  mapValues,
  mapKeys,
  getAllPaths,
  keyBy,
  invert,
  groupProperties,
  mergeWith,
  filterProperties
} from './property-manipulation';

describe('property manipulation utilities', () => {
  
  describe('pick', () => {
    it('should pick specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, [])).toEqual({});
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, ['a', 'nonexistent'] as any)).toEqual({ a: 1 });
    });

    it('should preserve property types', () => {
      const obj = { str: 'test', num: 42, bool: true };
      const result = pick(obj, ['str', 'num']);
      expect(result).toEqual({ str: 'test', num: 42 });
      expect(typeof result.str).toBe('string');
      expect(typeof result.num).toBe('number');
    });
  });

  describe('omit', () => {
    it('should omit specified properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['nonexistent'] as any)).toEqual({ a: 1, b: 2 });
    });

    it('should handle complex objects', () => {
      const obj = { 
        id: 1, 
        name: 'John', 
        password: 'secret', 
        email: 'john@example.com' 
      };
      expect(omit(obj, ['password'])).toEqual({ 
        id: 1, 
        name: 'John', 
        email: 'john@example.com' 
      });
    });
  });

  describe('pluck', () => {
    it('should pluck values by key from array of objects', () => {
      const array = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
        { name: 'Bob', age: 35 }
      ];
      expect(pluck(array, 'name')).toEqual(['John', 'Jane', 'Bob']);
      expect(pluck(array, 'age')).toEqual([30, 25, 35]);
    });

    it('should handle empty array', () => {
      expect(pluck([], 'name')).toEqual([]);
    });

    it('should handle undefined values', () => {
      const array = [
        { name: 'John', age: 30 },
        { name: 'Jane' },
        { name: 'Bob', age: 35 }
      ];
      expect(pluck(array, 'age')).toEqual([30, undefined, 35]);
    });
  });

  describe('mapValues', () => {
    it('should transform all values', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, x => x * 2);
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should provide key to mapper function', () => {
      const obj = { firstName: 'john', lastName: 'doe' };
      const result = mapValues(obj, (value, key) => `${key}: ${value.toUpperCase()}`);
      expect(result).toEqual({ 
        firstName: 'firstName: JOHN', 
        lastName: 'lastName: DOE' 
      });
    });

    it('should handle empty object', () => {
      expect(mapValues({}, x => x)).toEqual({});
    });

    it('should change value types', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = mapValues(obj, x => x.toString());
      expect(result).toEqual({ a: '1', b: '2', c: '3' });
    });
  });

  describe('mapKeys', () => {
    it('should transform all keys', () => {
      const obj = { first_name: 'John', last_name: 'Doe' };
      const result = mapKeys(obj, key => key.replace('_', ''));
      expect(result).toEqual({ firstname: 'John', lastname: 'Doe' });
    });

    it('should provide value to mapper function', () => {
      const obj = { a: 1, b: 2 };
      const result = mapKeys(obj, (key, value) => `${key}_${value}`);
      expect(result).toEqual({ a_1: 1, b_2: 2 });
    });

    it('should handle empty object', () => {
      expect(mapKeys({}, key => key)).toEqual({});
    });

    it('should handle key collisions', () => {
      const obj = { a: 1, b: 2 };
      const result = mapKeys(obj, () => 'same');
      // Last key wins in case of collision
      expect(result).toEqual({ same: 2 });
    });
  });

  describe('getAllPaths', () => {
    it('should get all paths in flat object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const paths = getAllPaths(obj);
      expect(paths.sort()).toEqual(['a', 'b', 'c']);
    });

    it('should get all paths in nested object', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      };
      const paths = getAllPaths(obj);
      expect(paths.sort()).toEqual(['a', 'b', 'b.c', 'b.d', 'b.d.e']);
    });

    it('should handle arrays', () => {
      const obj = {
        a: 1,
        b: [1, 2, 3],
        c: {
          d: 4
        }
      };
      const paths = getAllPaths(obj);
      expect(paths.sort()).toEqual(['a', 'b', 'c', 'c.d']);
    });

    it('should handle empty object', () => {
      expect(getAllPaths({})).toEqual([]);
    });
  });

  describe('keyBy', () => {
    it('should create object keyed by function result', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];
      const result = keyBy(array, item => item.id);
      expect(result).toEqual({
        1: { id: 1, name: 'John' },
        2: { id: 2, name: 'Jane' },
        3: { id: 3, name: 'Bob' }
      });
    });

    it('should handle string keys', () => {
      const array = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ];
      const result = keyBy(array, item => item.name);
      expect(result).toEqual({
        John: { name: 'John', age: 30 },
        Jane: { name: 'Jane', age: 25 }
      });
    });

    it('should handle empty array', () => {
      expect(keyBy([], x => x)).toEqual({});
    });

    it('should handle duplicate keys (last wins)', () => {
      const array = [
        { id: 1, name: 'John' },
        { id: 1, name: 'Jane' }
      ];
      const result = keyBy(array, item => item.id);
      expect(result).toEqual({
        1: { id: 1, name: 'Jane' }
      });
    });
  });

  describe('invert', () => {
    it('should swap keys and values', () => {
      const obj = { a: 'x', b: 'y', c: 'z' };
      expect(invert(obj)).toEqual({ x: 'a', y: 'b', z: 'c' });
    });

    it('should handle numeric values', () => {
      const obj = { first: 1, second: 2 };
      expect(invert(obj)).toEqual({ 1: 'first', 2: 'second' });
    });

    it('should handle empty object', () => {
      expect(invert({})).toEqual({});
    });

    it('should handle duplicate values (last wins)', () => {
      const obj = { a: 'same', b: 'same' };
      expect(invert(obj)).toEqual({ same: 'b' });
    });
  });

  describe('groupProperties', () => {
    it('should group properties by predicate', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const [even, odd] = groupProperties(obj, (_key, value) => value % 2 === 0);
      expect(even).toEqual({ b: 2, d: 4 });
      expect(odd).toEqual({ a: 1, c: 3 });
    });

    it('should group by key predicate', () => {
      const obj = { firstName: 'John', lastName: 'Doe', age: 30, email: 'john@example.com' };
      const [nameFields, otherFields] = groupProperties(obj, key => key.includes('Name'));
      expect(nameFields).toEqual({ firstName: 'John', lastName: 'Doe' });
      expect(otherFields).toEqual({ age: 30, email: 'john@example.com' });
    });

    it('should handle empty object', () => {
      const [truthy, falsy] = groupProperties({}, () => true);
      expect(truthy).toEqual({});
      expect(falsy).toEqual({});
    });

    it('should handle all true predicate', () => {
      const obj = { a: 1, b: 2 };
      const [truthy, falsy] = groupProperties(obj, () => true);
      expect(truthy).toEqual({ a: 1, b: 2 });
      expect(falsy).toEqual({});
    });

    it('should handle all false predicate', () => {
      const obj = { a: 1, b: 2 };
      const [truthy, falsy] = groupProperties(obj, () => false);
      expect(truthy).toEqual({});
      expect(falsy).toEqual({ a: 1, b: 2 });
    });
  });

  describe('mergeWith', () => {
    it('should merge with custom function', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = mergeWith(target, source, (targetVal, sourceVal) => targetVal + sourceVal);
      expect(result).toEqual({ a: 1, b: 5, c: 4 });
    });

    it('should provide key to merge function', () => {
      const target = { count: 5 };
      const source = { count: 3 };
      const result = mergeWith(target, source, (targetVal, sourceVal, key) => {
        return key === 'count' ? Math.max(targetVal, sourceVal) : sourceVal;
      });
      expect(result).toEqual({ count: 5 });
    });

    it('should handle non-overlapping keys', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = mergeWith(target, source, (targetVal, sourceVal) => targetVal + sourceVal);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should not mutate original objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = mergeWith(target, source, (targetVal, sourceVal) => targetVal + sourceVal);
      expect(target).toEqual({ a: 1, b: 2 });
      expect(source).toEqual({ b: 3, c: 4 });
      expect(result).toEqual({ a: 1, b: 5, c: 4 });
    });
  });

  describe('filterProperties', () => {
    it('should filter by value', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const result = filterProperties(obj, value => value > 2);
      expect(result).toEqual({ c: 3, d: 4 });
    });

    it('should filter by key', () => {
      const obj = { firstName: 'John', lastName: 'Doe', age: 30 };
      const result = filterProperties(obj, (_value, key) => key.includes('Name'));
      expect(result).toEqual({ firstName: 'John', lastName: 'Doe' });
    });

    it('should handle empty object', () => {
      expect(filterProperties({}, () => true)).toEqual({});
    });

    it('should handle no matches', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterProperties(obj, value => value > 10);
      expect(result).toEqual({});
    });

    it('should handle all matches', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = filterProperties(obj, () => true);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should filter by type', () => {
      const obj = { str: 'hello', num: 42, bool: true, null: null };
      const result = filterProperties(obj, value => typeof value === 'string');
      expect(result).toEqual({ str: 'hello' });
    });
  });
});
