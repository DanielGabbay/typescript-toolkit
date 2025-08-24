/* eslint-disable @typescript-eslint/no-explicit-any */

import { compose, safeCompose } from './compose';

describe('compose', () => {
  it('should compose single function', () => {
    const double = (x: number) => x * 2;
    const composed = compose(double);
    expect(composed(5)).toBe(10);
  });

  it('should compose multiple functions right to left', () => {
    const double = (x: number) => x * 2;
    const addOne = (x: number) => x + 1;
    const toString = (x: number) => x.toString();

    // Execution order: addOne(5) = 6, double(6) = 12, toString(12) = "12"
    const composed = compose(toString, double, addOne);
    expect(composed(5)).toBe('12');
  });

  it('should maintain type safety', () => {
    const result = compose(
      (s: string) => s.length,
      (n: number) => `Value: ${n}`,
      (x: number) => x * 2
    );
    expect(result(5)).toBe(9); // "Value: 10" has 9 characters
  });

  it('should handle identity composition', () => {
    const identity = (x: number) => x;
    const composed = compose(identity, identity, identity);
    expect(composed(42)).toBe(42);
  });

  it('should work with complex data transformations', () => {
    const composed = compose(
      Math.round,
      Math.sqrt,
      (obj: { value: number; multiplier: number }) => obj.value * obj.multiplier
    );
    
    const result = composed({ value: 10, multiplier: 3 });
    expect(result).toBe(5); // sqrt(30) ≈ 5.48, rounded = 5
  });

  it('should compose functions with different return types', () => {
    const numberToString = (x: number) => x.toString();
    const stringLength = (s: string) => s.length;
    const isEven = (n: number) => n % 2 === 0;

    const composed = compose(isEven, stringLength, numberToString);
    expect(composed(1234)).toBe(true); // "1234" has length 4, which is even
  });
});

describe('safeCompose', () => {
  it('should handle successful composition', () => {
    const double = (x: number) => x * 2;
    const addOne = (x: number) => x + 1;
    
    const composed = safeCompose(double, addOne);
    const result = composed(5);
    
    expect(result).toBe(12); // addOne(5) = 6, double(6) = 12
    expect(result).not.toBeInstanceOf(Error);
  });

  it('should catch and return errors', () => {
    const throwError = () => {
      throw new Error('Test error');
    };
    const double = (x: number) => x * 2;
    
    const composed = safeCompose(throwError, double);
    const result = composed(5);
    
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Test error');
  });

  it('should handle non-Error thrown values', () => {
    const throwString = () => {
      throw 'String error';
    };
    
    const composed = safeCompose(throwString);
    const result = composed(5);
    
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('String error');
  });

  it('should catch errors in any function in the chain', () => {
    const identity = (x: number) => x;
    const throwInMiddle = (x: number) => {
      if (x > 0) throw new Error('Positive number');
      return x;
    };
    
    const composed = safeCompose(identity, throwInMiddle, identity);
    const result = composed(5);
    
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Positive number');
  });

  it('should return successful result when no errors occur', () => {
    const addOne = (x: number) => x + 1;
    const double = (x: number) => x * 2;
    const toString = (x: number) => x.toString();
    
    const composed = safeCompose(toString, double, addOne);
    const result = composed(5);
    
    expect(result).toBe('12');
    expect(result).not.toBeInstanceOf(Error);
  });
});