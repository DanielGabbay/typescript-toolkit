import {
  flattenObject,
  unflattenObject,
  camelizeKeys,
  snakeCaseKeys,
  kebabCaseKeys,
  pascalCaseKeys,
  compact,
  removeEmpty,
  defaults,
  defaultsDeep,
  transform,
  type FieldMapping
} from './object-transform';

describe('object transformation utilities', () => {
  
  describe('flattenObject', () => {
    it('should flatten nested object with default separator', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      };
      expect(flattenObject(obj)).toEqual({
        'a': 1,
        'b.c': 2,
        'b.d.e': 3
      });
    });

    it('should handle custom separator', () => {
      const obj = { a: { b: { c: 'value' } } };
      expect(flattenObject(obj, '_')).toEqual({ 'a_b_c': 'value' });
    });

    it('should handle arrays as values', () => {
      const obj = { a: { b: [1, 2, 3] } };
      expect(flattenObject(obj)).toEqual({ 'a.b': [1, 2, 3] });
    });

    it('should handle empty object', () => {
      expect(flattenObject({})).toEqual({});
    });

    it('should handle flat object', () => {
      const obj = { a: 1, b: 2 };
      expect(flattenObject(obj)).toEqual({ a: 1, b: 2 });
    });

    it('should handle null and undefined values', () => {
      const obj = { a: { b: null, c: undefined } };
      expect(flattenObject(obj)).toEqual({ 'a.b': null, 'a.c': undefined });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten object with default separator', () => {
      const obj = {
        'a': 1,
        'b.c': 2,
        'b.d.e': 3
      };
      expect(unflattenObject(obj)).toEqual({
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      });
    });

    it('should handle custom separator', () => {
      const obj = { 'a_b_c': 'value' };
      expect(unflattenObject(obj, '_')).toEqual({ a: { b: { c: 'value' } } });
    });

    it('should handle empty object', () => {
      expect(unflattenObject({})).toEqual({});
    });

    it('should handle flat keys', () => {
      const obj = { a: 1, b: 2 };
      expect(unflattenObject(obj)).toEqual({ a: 1, b: 2 });
    });

    it('should be inverse of flatten', () => {
      const original = {
        user: {
          name: 'John',
          profile: {
            age: 30,
            city: 'NYC'
          }
        },
        settings: {
          theme: 'dark'
        }
      };
      const flattened = flattenObject(original);
      const unflattened = unflattenObject(flattened);
      expect(unflattened).toEqual(original);
    });
  });

  describe('camelizeKeys', () => {
    it('should convert snake_case keys to camelCase', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        user_profile: {
          phone_number: '123456789'
        }
      };
      expect(camelizeKeys(obj)).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        userProfile: {
          phoneNumber: '123456789'
        }
      });
    });

    it('should handle arrays', () => {
      const obj = {
        user_list: [
          { first_name: 'John' },
          { first_name: 'Jane' }
        ]
      };
      expect(camelizeKeys(obj)).toEqual({
        userList: [
          { firstName: 'John' },
          { firstName: 'Jane' }
        ]
      });
    });

    it('should handle primitive values', () => {
      expect(camelizeKeys('string')).toBe('string');
      expect(camelizeKeys(123)).toBe(123);
      expect(camelizeKeys(null)).toBeNull();
    });

    it('should handle already camelCase keys', () => {
      const obj = { firstName: 'John', lastName: 'Doe' };
      expect(camelizeKeys(obj)).toEqual({ firstName: 'John', lastName: 'Doe' });
    });
  });

  describe('snakeCaseKeys', () => {
    it('should convert camelCase keys to snake_case', () => {
      const obj = {
        firstName: 'John',
        lastName: 'Doe',
        userProfile: {
          phoneNumber: '123456789'
        }
      };
      expect(snakeCaseKeys(obj)).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        user_profile: {
          phone_number: '123456789'
        }
      });
    });

    it('should handle arrays', () => {
      const obj = {
        userList: [
          { firstName: 'John' },
          { firstName: 'Jane' }
        ]
      };
      expect(snakeCaseKeys(obj)).toEqual({
        user_list: [
          { first_name: 'John' },
          { first_name: 'Jane' }
        ]
      });
    });

    it('should handle primitive values', () => {
      expect(snakeCaseKeys('string')).toBe('string');
      expect(snakeCaseKeys(123)).toBe(123);
      expect(snakeCaseKeys(null)).toBeNull();
    });

    it('should handle already snake_case keys', () => {
      const obj = { first_name: 'John', last_name: 'Doe' };
      expect(snakeCaseKeys(obj)).toEqual({ first_name: 'John', last_name: 'Doe' });
    });
  });

  describe('kebabCaseKeys', () => {
    it('should convert camelCase keys to kebab-case', () => {
      const obj = {
        firstName: 'John',
        lastName: 'Doe',
        userProfile: {
          phoneNumber: '123456789'
        }
      };
      expect(kebabCaseKeys(obj)).toEqual({
        'first-name': 'John',
        'last-name': 'Doe',
        'user-profile': {
          'phone-number': '123456789'
        }
      });
    });

    it('should handle arrays', () => {
      const obj = {
        userList: [
          { firstName: 'John' },
          { firstName: 'Jane' }
        ]
      };
      expect(kebabCaseKeys(obj)).toEqual({
        'user-list': [
          { 'first-name': 'John' },
          { 'first-name': 'Jane' }
        ]
      });
    });

    it('should not add leading dash', () => {
      const obj = { FirstName: 'John' };
      expect(kebabCaseKeys(obj)).toEqual({ 'first-name': 'John' });
    });

    it('should handle primitive values', () => {
      expect(kebabCaseKeys('string')).toBe('string');
      expect(kebabCaseKeys(123)).toBe(123);
      expect(kebabCaseKeys(null)).toBeNull();
    });
  });

  describe('pascalCaseKeys', () => {
    it('should convert snake_case keys to PascalCase', () => {
      const obj = {
        first_name: 'John',
        last_name: 'Doe',
        user_profile: {
          phone_number: '123456789'
        }
      };
      expect(pascalCaseKeys(obj)).toEqual({
        FirstName: 'John',
        LastName: 'Doe',
        UserProfile: {
          PhoneNumber: '123456789'
        }
      });
    });

    it('should handle arrays', () => {
      const obj = {
        user_list: [
          { first_name: 'John' },
          { first_name: 'Jane' }
        ]
      };
      expect(pascalCaseKeys(obj)).toEqual({
        UserList: [
          { FirstName: 'John' },
          { FirstName: 'Jane' }
        ]
      });
    });

    it('should handle primitive values', () => {
      expect(pascalCaseKeys('string')).toBe('string');
      expect(pascalCaseKeys(123)).toBe(123);
      expect(pascalCaseKeys(null)).toBeNull();
    });

    it('should handle camelCase keys', () => {
      const obj = { firstName: 'John' };
      expect(pascalCaseKeys(obj)).toEqual({ FirstName: 'John' });
    });
  });

  describe('compact', () => {
    it('should remove null and undefined values', () => {
      const obj = {
        a: 1,
        b: null,
        c: undefined,
        d: {
          e: 2,
          f: null,
          g: undefined
        }
      };
      expect(compact(obj)).toEqual({
        a: 1,
        d: {
          e: 2
        }
      });
    });

    it('should handle arrays', () => {
      const obj = {
        arr: [1, null, undefined, 2, { a: null, b: 3 }]
      };
      expect(compact(obj)).toEqual({
        arr: [1, 2, { b: 3 }]
      });
    });

    it('should preserve falsy values that are not null/undefined', () => {
      const obj = {
        zero: 0,
        false: false,
        empty: '',
        null: null,
        undefined: undefined
      };
      expect(compact(obj)).toEqual({
        zero: 0,
        false: false,
        empty: ''
      });
    });

    it('should handle primitive values', () => {
      expect(compact('string')).toBe('string');
      expect(compact(123)).toBe(123);
      expect(compact(null)).toBeNull();
    });
  });

  describe('removeEmpty', () => {
    it('should remove empty objects and arrays', () => {
      const obj = {
        a: 1,
        b: {},
        c: [],
        d: {
          e: 2,
          f: {},
          g: []
        },
        h: {
          i: {}
        }
      };
      expect(removeEmpty(obj)).toEqual({
        a: 1,
        d: {
          e: 2
        }
      });
    });

    it('should handle nested empty structures', () => {
      const obj = {
        a: {
          b: {
            c: {}
          }
        },
        d: {
          e: 'value'
        }
      };
      expect(removeEmpty(obj)).toEqual({
        d: {
          e: 'value'
        }
      });
    });

    it('should handle arrays with empty objects', () => {
      const obj = {
        arr: [{}, { a: 1 }, [], { b: {} }, { c: 'value' }]
      };
      expect(removeEmpty(obj)).toEqual({
        arr: [{ a: 1 }, { c: 'value' }]
      });
    });

    it('should return undefined for completely empty objects', () => {
      expect(removeEmpty({})).toBeUndefined();
      expect(removeEmpty([])).toBeUndefined();
      expect(removeEmpty({ a: {} })).toBeUndefined();
    });
  });

  describe('defaults', () => {
    it('should apply default values for missing keys', () => {
      const obj = { a: 1 };
      const defaultValues = { a: 999, b: 2, c: 3 };
      expect(defaults(obj, defaultValues)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should not override existing values', () => {
      const obj = { a: 1, b: 2 };
      const defaultValues = { a: 999, b: 999, c: 3 };
      expect(defaults(obj, defaultValues)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle undefined values', () => {
      const obj = { a: undefined, b: 2 };
      const defaultValues = { a: 1, b: 999, c: 3 };
      expect(defaults(obj, defaultValues)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should preserve null values', () => {
      const obj = { a: null as any, b: 2 };
      const defaultValues = { a: 1, b: 999, c: 3 };
      expect(defaults(obj, defaultValues)).toEqual({ a: null, b: 2, c: 3 });
    });
  });

  describe('defaultsDeep', () => {
    it('should apply deep default values', () => {
      const obj = {
        user: {
          name: 'John'
        }
      } as any;
      const defaultValues = {
        user: {
          name: 'Default',
          age: 30,
          profile: {
            city: 'NYC'
          }
        },
        settings: {
          theme: 'dark'
        }
      };
      expect(defaultsDeep(obj, defaultValues)).toEqual({
        user: {
          name: 'John',
          age: 30,
          profile: {
            city: 'NYC'
          }
        },
        settings: {
          theme: 'dark'
        }
      });
    });

    it('should handle nested objects recursively', () => {
      const obj = {
        a: {
          b: {
            c: 'value'
          }
        }
      } as any;
      const defaultValues = {
        a: {
          b: {
            c: 'default',
            d: 'additional'
          },
          e: 'more'
        }
      };
      expect(defaultsDeep(obj, defaultValues)).toEqual({
        a: {
          b: {
            c: 'value',
            d: 'additional'
          },
          e: 'more'
        }
      });
    });

    it('should not merge arrays', () => {
      const obj = { arr: [1, 2] };
      const defaultValues = { arr: [3, 4, 5] };
      expect(defaultsDeep(obj, defaultValues)).toEqual({ arr: [1, 2] });
    });
  });

  describe('transform', () => {
    const sourceObj = {
      first_name: 'John',
      last_name: 'Doe',
      age: 30,
      email: 'john@example.com'
    };

    it('should transform object using field mappings', () => {
      const mappings: FieldMapping[] = [
        { from: 'first_name', to: 'firstName' },
        { from: 'last_name', to: 'lastName' },
        { from: 'age' }
      ];
      expect(transform(sourceObj, mappings)).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        age: 30
      });
    });

    it('should apply transform functions', () => {
      const mappings: FieldMapping[] = [
        { from: 'first_name', to: 'firstName', transform: (val) => val.toUpperCase() },
        { from: 'age', to: 'ageInMonths', transform: (val) => val * 12 }
      ];
      expect(transform(sourceObj, mappings)).toEqual({
        firstName: 'JOHN',
        ageInMonths: 360
      });
    });

    it('should skip non-existent fields', () => {
      const mappings: FieldMapping[] = [
        { from: 'first_name', to: 'firstName' },
        { from: 'nonexistent', to: 'missing' }
      ];
      expect(transform(sourceObj, mappings)).toEqual({
        firstName: 'John'
      });
    });

    it('should handle empty mappings', () => {
      expect(transform(sourceObj, [])).toEqual({});
    });

    it('should use original key when no "to" is specified', () => {
      const mappings: FieldMapping[] = [
        { from: 'age', transform: (val) => val + 1 }
      ];
      expect(transform(sourceObj, mappings)).toEqual({
        age: 31
      });
    });
  });
});
