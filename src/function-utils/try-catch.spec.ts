/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  tryCatch,
  tryCatchAsync,
  makeSafe,
  makeSafeAsync,
  tryCatchAll,
  tryCatchAllAsync,
  isSuccess,
  isError,
  unwrap,
  unwrapOr,
  chain,
  mapResult
} from './try-catch';

describe('tryCatch', () => {
  it('should return success result for successful function', () => {
    const result = tryCatch(() => 42);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
      expect(result.error).toBeNull();
    }
  });

  it('should return error result for throwing function', () => {
    const error = new Error('test error');
    const result = tryCatch(() => {
      throw error;
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
    }
  });

  it('should convert non-Error throws to Error', () => {
    const result = tryCatch(() => {
      throw 'string error';
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('string error');
    }
  });

  it('should work with complex return types', () => {
    const obj = { name: 'test', value: 123 };
    const result = tryCatch(() => obj);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(obj);
    }
  });
});

describe('tryCatchAsync', () => {
  it('should return success result for successful async function', async () => {
    const result = await tryCatchAsync(async () => 'success');
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
    }
  });

  it('should return error result for rejecting async function', async () => {
    const error = new Error('async error');
    const result = await tryCatchAsync(async () => {
      throw error;
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
    }
  });

  it('should convert non-Error rejections to Error', async () => {
    const result = await tryCatchAsync(async () => {
      throw 123;
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('123');
    }
  });

  it('should work with Promise that resolves', async () => {
    const result = await tryCatchAsync(() => Promise.resolve('resolved'));
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('resolved');
    }
  });
});

describe('makeSafe', () => {
  it('should create a safe version of a function', () => {
    const divide = (a: number, b: number) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    };
    
    const safeDivide = makeSafe(divide);
    
    const successResult = safeDivide(10, 2);
    expect(successResult.success).toBe(true);
    if (successResult.success) {
      expect(successResult.data).toBe(5);
    }
    
    const errorResult = safeDivide(10, 0);
    expect(errorResult.success).toBe(false);
    if (!errorResult.success) {
      expect(errorResult.error.message).toBe('Division by zero');
    }
  });

  it('should preserve function arguments', () => {
    const concat = (a: string, b: string, c: string) => a + b + c;
    const safeConcat = makeSafe(concat);
    
    const result = safeConcat('a', 'b', 'c');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('abc');
    }
  });
});

describe('makeSafeAsync', () => {
  it('should create a safe version of an async function', async () => {
    const asyncDivide = async (a: number, b: number) => {
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    };
    
    const safeAsyncDivide = makeSafeAsync(asyncDivide);
    
    const successResult = await safeAsyncDivide(10, 2);
    expect(successResult.success).toBe(true);
    if (successResult.success) {
      expect(successResult.data).toBe(5);
    }
    
    const errorResult = await safeAsyncDivide(10, 0);
    expect(errorResult.success).toBe(false);
    if (!errorResult.success) {
      expect(errorResult.error.message).toBe('Division by zero');
    }
  });
});

describe('tryCatchAll', () => {
  it('should execute all functions and return their results', () => {
    const fn1 = () => 'success1';
    const fn2 = () => { throw new Error('error2'); };
    const fn3 = () => 42;
    
    const results = tryCatchAll(fn1, fn2, fn3);
    
    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[2].success).toBe(true);
    
    if (results[0].success) {
      expect(results[0].data).toBe('success1');
    }
    if (!results[1].success) {
      expect(results[1].error.message).toBe('error2');
    }
    if (results[2].success) {
      expect(results[2].data).toBe(42);
    }
  });

  it('should handle empty function list', () => {
    const results = tryCatchAll();
    expect(results).toHaveLength(0);
  });
});

describe('tryCatchAllAsync', () => {
  it('should execute all async functions and return their results', async () => {
    const fn1 = async () => 'success1';
    const fn2 = async () => { throw new Error('error2'); };
    const fn3 = async () => 42;
    
    const results = await tryCatchAllAsync(fn1, fn2, fn3);
    
    expect(results).toHaveLength(3);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(false);
    expect(results[2].success).toBe(true);
    
    if (results[0].success) {
      expect(results[0].data).toBe('success1');
    }
    if (!results[1].success) {
      expect(results[1].error.message).toBe('error2');
    }
    if (results[2].success) {
      expect(results[2].data).toBe(42);
    }
  });
});

describe('isSuccess', () => {
  it('should correctly identify success results', () => {
    const successResult = tryCatch(() => 42);
    const errorResult = tryCatch(() => { throw new Error(); });
    
    expect(isSuccess(successResult)).toBe(true);
    expect(isSuccess(errorResult)).toBe(false);
  });
});

describe('isError', () => {
  it('should correctly identify error results', () => {
    const successResult = tryCatch(() => 42);
    const errorResult = tryCatch(() => { throw new Error(); });
    
    expect(isError(successResult)).toBe(false);
    expect(isError(errorResult)).toBe(true);
  });
});

describe('unwrap', () => {
  it('should return data from success result', () => {
    const result = tryCatch(() => 42);
    expect(unwrap(result)).toBe(42);
  });

  it('should throw error from error result', () => {
    const error = new Error('test error');
    const result = tryCatch(() => { throw error; });
    
    expect(() => unwrap(result)).toThrow('test error');
  });
});

describe('unwrapOr', () => {
  it('should return data from success result', () => {
    const result = tryCatch(() => 42);
    expect(unwrapOr(result, 0)).toBe(42);
  });

  it('should return default value from error result', () => {
    const result = tryCatch(() => { throw new Error(); });
    expect(unwrapOr(result, 'default')).toBe('default');
  });
});

describe('chain', () => {
  it('should chain successful operations', () => {
    const result1 = tryCatch(() => 5);
    const result2 = chain(result1, (x) => tryCatch(() => x * 2));
    
    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data).toBe(10);
    }
  });

  it('should stop chaining on first error', () => {
    const result1 = tryCatch(() => { throw new Error('first error'); });
    const result2 = chain(result1, (x) => tryCatch(() => x * 2));
    
    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.error.message).toBe('first error');
    }
  });

  it('should propagate error from chained operation', () => {
    const result1 = tryCatch(() => 5);
    const result2 = chain(result1, () => tryCatch(() => { throw new Error('chain error'); }));
    
    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.error.message).toBe('chain error');
    }
  });
});

describe('mapResult', () => {
  it('should transform successful result', () => {
    const result1 = tryCatch(() => 5);
    const result2 = mapResult(result1, (x) => x * 2);
    
    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data).toBe(10);
    }
  });

  it('should pass through error result unchanged', () => {
    const error = new Error('original error');
    const result1 = tryCatch(() => { throw error; });
    const result2 = mapResult(result1, (x) => x * 2);
    
    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.error).toBe(error);
    }
  });

  it('should catch errors thrown by mapping function', () => {
    const result1 = tryCatch(() => 5);
    const result2 = mapResult(result1, () => { throw new Error('map error'); });
    
    expect(result2.success).toBe(false);
    if (!result2.success) {
      expect(result2.error.message).toBe('map error');
    }
  });
});