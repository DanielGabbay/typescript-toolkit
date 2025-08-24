/* eslint-disable @typescript-eslint/no-explicit-any */

import { TypeFrom } from './type-from';

describe('TypeFrom', () => {
  it('should work as a type utility - compile time test', () => {
    // This test verifies that the type works correctly at compile time
    
    // These type assignments should compile without errors
    const assertType = <T>(_value: T): T => _value as T;
    
    type TestType = TypeFrom<{ a: 'hello'; b: 'world'; c: 42 }>;
    
    // If these compile, the type is working correctly
    assertType<TestType>('hello');
    assertType<TestType>('world');
    assertType<TestType>(42);
    
    expect(true).toBe(true); // Placeholder assertion
  });

  it('should extract values from string literal object', () => {
    const colors = { red: 'red', blue: 'blue', green: 'green' } as const;
    type ColorValues = TypeFrom<typeof colors>;
    
    const isValidColor = (value: string): value is ColorValues => {
      return Object.values(colors).includes(value as ColorValues);
    };
    
    expect(isValidColor('red')).toBe(true);
    expect(isValidColor('blue')).toBe(true);
    expect(isValidColor('yellow')).toBe(false);
  });

  it('should work with mixed value types in runtime helper', () => {
    const config = { 
      name: 'app', 
      version: 1, 
      enabled: true,
      mode: 'production' 
    } as const;
    
    type ConfigValues = TypeFrom<typeof config>;
    
    const isValidConfigValue = (value: unknown): value is ConfigValues => {
      return Object.values(config).includes(value as ConfigValues);
    };
    
    expect(isValidConfigValue('app')).toBe(true);
    expect(isValidConfigValue(1)).toBe(true);
    expect(isValidConfigValue(true)).toBe(true);
    expect(isValidConfigValue('production')).toBe(true);
    expect(isValidConfigValue('invalid')).toBe(false);
  });
});
