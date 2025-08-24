import { describe, it, expect } from 'vitest';
import { 
  isString, isNumber, isBoolean, isObject, isArray, isFunction,
  isNull, isUndefined, isNullish, isDefined,
  createEnum, getEnumValues, getEnumKeys, isEnumValue,
  assertType, assertString, assertNumber, assertObject
} from '../src/type';

describe('type utilities', () => {
  describe('type guards', () => {
    describe('isString', () => {
      it('should return true for strings', () => {
        expect(isString('hello')).toBe(true);
        expect(isString('')).toBe(true);
        expect(isString(String('test'))).toBe(true);
      });

      it('should return false for non-strings', () => {
        expect(isString(42)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString({})).toBe(false);
      });
    });

    describe('isNumber', () => {
      it('should return true for valid numbers', () => {
        expect(isNumber(42)).toBe(true);
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-1)).toBe(true);
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber(Infinity)).toBe(true);
      });

      it('should return false for NaN and non-numbers', () => {
        expect(isNumber(NaN)).toBe(false);
        expect(isNumber('42')).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
      });
    });

    describe('isBoolean', () => {
      it('should return true for booleans', () => {
        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);
      });

      it('should return false for non-booleans', () => {
        expect(isBoolean(1)).toBe(false);
        expect(isBoolean('true')).toBe(false);
        expect(isBoolean(null)).toBe(false);
      });
    });

    describe('isObject', () => {
      it('should return true for objects', () => {
        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(true);
        expect(isObject(new Date())).toBe(true);
      });

      it('should return false for non-objects', () => {
        expect(isObject(null)).toBe(false);
        expect(isObject('string')).toBe(false);
        expect(isObject(42)).toBe(false);
      });
    });

    describe('isArray', () => {
      it('should return true for arrays', () => {
        expect(isArray([])).toBe(true);
        expect(isArray([1, 2, 3])).toBe(true);
        expect(isArray(new Array(5))).toBe(true);
      });

      it('should return false for non-arrays', () => {
        expect(isArray({})).toBe(false);
        expect(isArray('string')).toBe(false);
        expect(isArray(null)).toBe(false);
      });
    });

    describe('isFunction', () => {
      it('should return true for functions', () => {
        expect(isFunction(() => {})).toBe(true);
        expect(isFunction(function() {})).toBe(true);
        expect(isFunction(Date)).toBe(true);
      });

      it('should return false for non-functions', () => {
        expect(isFunction({})).toBe(false);
        expect(isFunction('string')).toBe(false);
        expect(isFunction(42)).toBe(false);
      });
    });

    describe('isNull', () => {
      it('should return true only for null', () => {
        expect(isNull(null)).toBe(true);
        expect(isNull(undefined)).toBe(false);
        expect(isNull(0)).toBe(false);
        expect(isNull('')).toBe(false);
      });
    });

    describe('isUndefined', () => {
      it('should return true only for undefined', () => {
        expect(isUndefined(undefined)).toBe(true);
        expect(isUndefined(null)).toBe(false);
        expect(isUndefined(0)).toBe(false);
        expect(isUndefined('')).toBe(false);
      });
    });

    describe('isNullish', () => {
      it('should return true for null and undefined', () => {
        expect(isNullish(null)).toBe(true);
        expect(isNullish(undefined)).toBe(true);
        expect(isNullish(0)).toBe(false);
        expect(isNullish('')).toBe(false);
        expect(isNullish(false)).toBe(false);
      });
    });

    describe('isDefined', () => {
      it('should return true for defined values', () => {
        expect(isDefined(0)).toBe(true);
        expect(isDefined('')).toBe(true);
        expect(isDefined(false)).toBe(true);
        expect(isDefined([])).toBe(true);
        expect(isDefined({})).toBe(true);
      });

      it('should return false for null and undefined', () => {
        expect(isDefined(null)).toBe(false);
        expect(isDefined(undefined)).toBe(false);
      });
    });
  });

  describe('enum utilities', () => {
    const TestEnum = { RED: 'red', GREEN: 'green', BLUE: 'blue' } as const;

    describe('createEnum', () => {
      it('should create frozen enum-like object', () => {
        const colors = createEnum({ RED: 'red', BLUE: 'blue' });
        
        expect(Object.isFrozen(colors)).toBe(true);
        expect(colors.RED).toBe('red');
        expect(colors.BLUE).toBe('blue');
      });
    });

    describe('getEnumValues', () => {
      it('should return array of enum values', () => {
        const values = getEnumValues(TestEnum);
        expect(values).toEqual(['red', 'green', 'blue']);
      });
    });

    describe('getEnumKeys', () => {
      it('should return array of enum keys', () => {
        const keys = getEnumKeys(TestEnum);
        expect(keys).toEqual(['RED', 'GREEN', 'BLUE']);
      });
    });

    describe('isEnumValue', () => {
      it('should return true for valid enum values', () => {
        expect(isEnumValue(TestEnum, 'red')).toBe(true);
        expect(isEnumValue(TestEnum, 'green')).toBe(true);
        expect(isEnumValue(TestEnum, 'blue')).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isEnumValue(TestEnum, 'yellow')).toBe(false);
        expect(isEnumValue(TestEnum, 'RED')).toBe(false);
        expect(isEnumValue(TestEnum, 42)).toBe(false);
      });
    });
  });

  describe('type assertions', () => {
    describe('assertType', () => {
      it('should return value when guard passes', () => {
        const result = assertType('hello', isString);
        expect(result).toBe('hello');
      });

      it('should throw when guard fails', () => {
        expect(() => assertType(42, isString)).toThrow('Type assertion failed');
      });
    });

    describe('assertString', () => {
      it('should return string when value is string', () => {
        expect(assertString('hello')).toBe('hello');
      });

      it('should throw when value is not string', () => {
        expect(() => assertString(42)).toThrow('Type assertion failed');
      });
    });

    describe('assertNumber', () => {
      it('should return number when value is number', () => {
        expect(assertNumber(42)).toBe(42);
      });

      it('should throw when value is not number', () => {
        expect(() => assertNumber('42')).toThrow('Type assertion failed');
      });
    });

    describe('assertObject', () => {
      it('should return object when value is object', () => {
        const obj = { a: 1 };
        expect(assertObject(obj)).toBe(obj);
      });

      it('should throw when value is not object', () => {
        expect(() => assertObject('not object')).toThrow('Type assertion failed');
      });
    });
  });
});