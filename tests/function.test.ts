import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  compose, pipe, curry, debounce, throttle, memoize, retry, tryCatch 
} from '../src/function';

describe('function utilities', () => {
  describe('compose', () => {
    it('should compose functions right-to-left', () => {
      const add1 = (x: number) => x + 1;
      const multiply2 = (x: number) => x * 2;
      const composed = compose(add1, multiply2);
      
      expect(composed(3)).toBe(7); // 3 * 2 + 1 = 7
    });

    it('should work with single function', () => {
      const add1 = (x: number) => x + 1;
      const composed = compose(add1);
      
      expect(composed(5)).toBe(6);
    });
  });

  describe('pipe', () => {
    it('should compose functions left-to-right', () => {
      const add1 = (x: number) => x + 1;
      const multiply2 = (x: number) => x * 2;
      const piped = pipe(add1, multiply2);
      
      expect(piped(3)).toBe(8); // (3 + 1) * 2 = 8
    });
  });

  describe('curry', () => {
    it('should curry a function', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);
      
      expect(curriedAdd(1)(2)).toBe(3);
      expect(curriedAdd(1, 2)).toBe(3);
    });

    it('should work with three parameters', () => {
      const add3 = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd3 = curry(add3);
      
      expect(curriedAdd3(1)(2)(3)).toBe(6);
      expect(curriedAdd3(1, 2)(3)).toBe(6);
      expect(curriedAdd3(1)(2, 3)).toBe(6);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('should call with latest arguments', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('third');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledOnce();

      vi.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledOnce();
    });

    it('should use custom key function', () => {
      const fn = vi.fn((obj: { id: number; name: string }) => obj.name.toUpperCase());
      const memoized = memoize(fn, (obj) => obj.id.toString());

      const obj1 = { id: 1, name: 'test' };
      const obj2 = { id: 1, name: 'different' }; // Same id, different name

      expect(memoized(obj1)).toBe('TEST');
      expect(memoized(obj2)).toBe('TEST'); // Should return cached result
      expect(fn).toHaveBeenCalledOnce();
    });
  });

  describe('retry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const failTwice = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Failed');
        }
        return 'success';
      };

      const result = await retry(failTwice, 3);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should throw after max attempts', async () => {
      const alwaysFail = async () => {
        throw new Error('Always fails');
      };

      await expect(retry(alwaysFail, 2)).rejects.toThrow('Always fails');
    });
  });

  describe('tryCatch', () => {
    it('should return result on success', () => {
      const result = tryCatch(() => 'success');
      expect(result).toBe('success');
    });

    it('should return undefined on error', () => {
      const result = tryCatch(() => {
        throw new Error('Failed');
      });
      expect(result).toBeUndefined();
    });

    it('should call error handler', () => {
      const result = tryCatch(
        () => {
          throw new Error('Failed');
        },
        (error) => `Caught: ${error.message}`
      );
      expect(result).toBe('Caught: Failed');
    });
  });
});