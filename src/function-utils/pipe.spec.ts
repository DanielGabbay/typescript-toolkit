/* eslint-disable @typescript-eslint/no-explicit-any */

import { pipe, pipeAsync } from './pipe';

describe('pipe', () => {
  it('should return value when no functions provided', () => {
    expect(pipe(5)).toBe(5);
    expect(pipe('hello')).toBe('hello');
  });

  it('should pipe single function', () => {
    const double = (x: number) => x * 2;
    expect(pipe(5, double)).toBe(10);
  });

  it('should pipe multiple functions left to right', () => {
    const double = (x: number) => x * 2;
    const addOne = (x: number) => x + 1;
    const toString = (x: number) => x.toString();

    expect(pipe(5, double, addOne, toString)).toBe('11');
  });

  it('should maintain type safety across transformations', () => {
    const result = pipe(
      5,
      x => x * 2,
      x => `Value: ${x}`,
      s => s.length
    );
    expect(result).toBe(9); // "Value: 10" has 9 characters
  });

  it('should handle complex data transformations', () => {
    const data = { value: 10, multiplier: 3 };
    const result = pipe(
      data,
      d => d.value * d.multiplier,
      x => Math.sqrt(x),
      x => Math.round(x)
    );
    expect(result).toBe(5); // sqrt(30) ≈ 5.48, rounded = 5
  });
});

describe('pipeAsync', () => {
  it('should handle async single value', async () => {
    const result = await pipeAsync(Promise.resolve(5));
    expect(result).toBe(5);
  });

  it('should handle sync single value', async () => {
    const result = await pipeAsync(5);
    expect(result).toBe(5);
  });

  it('should pipe async functions', async () => {
    const asyncDouble = async (x: number) => x * 2;
    const asyncAddOne = async (x: number) => x + 1;

    const result = await pipeAsync(5, asyncDouble, asyncAddOne);
    expect(result).toBe(11);
  });

  it('should pipe mix of sync and async functions', async () => {
    const syncDouble = (x: number) => x * 2;
    const asyncAddOne = async (x: number) => x + 1;
    const syncToString = (x: number) => x.toString();

    const result = await pipeAsync(5, syncDouble, asyncAddOne, syncToString);
    expect(result).toBe('11');
  });

  it('should handle async value input with sync functions', async () => {
    const asyncValue = Promise.resolve(10);
    const double = (x: number) => x * 2;
    const addOne = (x: number) => x + 1;

    const result = await pipeAsync(asyncValue, double, addOne);
    expect(result).toBe(21);
  });

  it('should handle promise rejection', async () => {
    const asyncError = async () => {
      throw new Error('Test error');
    };

    await expect(pipeAsync(5, asyncError)).rejects.toThrow('Test error');
  });

  it('should process async transformations sequentially', async () => {
    const order: number[] = [];
    const async1 = async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 10));
      order.push(1);
      return x + 1;
    };
    const async2 = async (x: number) => {
      await new Promise(resolve => setTimeout(resolve, 5));
      order.push(2);
      return x + 1;
    };

    const result = await pipeAsync(0, async1, async2);
    expect(result).toBe(2);
    expect(order).toEqual([1, 2]);
  });
});