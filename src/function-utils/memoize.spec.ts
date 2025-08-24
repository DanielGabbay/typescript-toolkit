/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { memoize, createClearableMemoize } from './memoize';

describe('memoize', () => {
  it('should cache function results', () => {
    let callCount = 0;
    const expensive = (x: number) => {
      callCount++;
      return x * 2;
    };
    
    const memoized = memoize(expensive);
    
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);
  });

  it('should work with multiple arguments', () => {
    let callCount = 0;
    const add = (a: number, b: number, c: number) => {
      callCount++;
      return a + b + c;
    };
    
    const memoized = memoize(add);
    
    expect(memoized(1, 2, 3)).toBe(6);
    expect(memoized(1, 2, 3)).toBe(6);
    expect(memoized(1, 2, 4)).toBe(7);
    expect(callCount).toBe(2);
  });

  it('should use custom key resolver', () => {
    let callCount = 0;
    const getUser = (id: number, details: boolean) => {
      callCount++;
      return { id, name: `User${id}`, details };
    };
    
    const memoized = memoize(getUser, {
      keyResolver: (id: number) => `user_${id}` // Ignore details parameter
    });
    
    expect(memoized(1, true)).toEqual({ id: 1, name: 'User1', details: true });
    expect(memoized(1, false)).toEqual({ id: 1, name: 'User1', details: true });
    expect(callCount).toBe(1);
  });

  it('should respect max size (LRU)', () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x;
    };
    
    const memoized = memoize(fn, { maxSize: 2 });
    
    memoized(1); // Cache: [1]
    memoized(2); // Cache: [1, 2]
    memoized(3); // Cache: [2, 3] (1 evicted)
    memoized(1); // Cache: [3, 1] (2 evicted, 1 recalculated)
    
    expect(callCount).toBe(4);
  });

  it('should handle TTL expiration', async () => {
    jest.useFakeTimers();
    
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x * 2;
    };
    
    const memoized = memoize(fn, { ttl: 100 }); // 100ms TTL
    
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);
    
    // Within TTL - should use cache
    jest.advanceTimersByTime(50);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);
    
    // After TTL - should recalculate
    jest.advanceTimersByTime(60);
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(2);
    
    jest.useRealTimers();
  });

  it('should use weak strategy for object keys', () => {
    let callCount = 0;
    const processObject = (obj: object) => {
      callCount++;
      return Object.keys(obj).length;
    };
    
    const memoized = memoize(processObject, { strategy: 'weak' });
    
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3 };
    
    expect(memoized(obj1)).toBe(2);
    expect(memoized(obj1)).toBe(2);
    expect(memoized(obj2)).toBe(1);
    expect(callCount).toBe(2);
  });

  it('should update LRU order on cache hits', () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x;
    };
    
    const memoized = memoize(fn, { maxSize: 2 });
    
    memoized(1); // Cache: [1]
    memoized(2); // Cache: [1, 2]
    memoized(1); // Cache: [2, 1] (1 moved to end)
    memoized(3); // Cache: [1, 3] (2 evicted as it's oldest)
    memoized(2); // Should recalculate as 2 was evicted
    
    expect(callCount).toBe(4);
  });

  it('should handle complex objects as arguments', () => {
    let callCount = 0;
    const processData = (data: { id: number; values: number[] }) => {
      callCount++;
      return data.values.reduce((sum, v) => sum + v, 0);
    };
    
    const memoized = memoize(processData);
    
    const data1 = { id: 1, values: [1, 2, 3] };
    const data2 = { id: 1, values: [1, 2, 3] };
    
    expect(memoized(data1)).toBe(6);
    expect(memoized(data2)).toBe(6); // Different object reference, but same JSON
    expect(callCount).toBe(1); // Should be cached due to JSON serialization
  });
});

describe('createClearableMemoize', () => {
  it('should provide clear functionality', () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x * 2;
    };
    
    const { memoized, clear, size } = createClearableMemoize(fn);
    
    expect(memoized(5)).toBe(10);
    expect(size()).toBe(1);
    expect(callCount).toBe(1);
    
    // Should use cache
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(1);
    
    // Clear cache
    clear();
    expect(size()).toBe(0);
    
    // Should recalculate after clear
    expect(memoized(5)).toBe(10);
    expect(callCount).toBe(2);
  });

  it('should track cache size correctly', () => {
    const fn = (x: number) => x;
    const { memoized, size } = createClearableMemoize(fn);
    
    expect(size()).toBe(0);
    
    memoized(1);
    expect(size()).toBe(1);
    
    memoized(2);
    expect(size()).toBe(2);
    
    memoized(1); // Cache hit
    expect(size()).toBe(2);
  });

  it('should work with options', () => {
    let callCount = 0;
    const fn = (x: number) => {
      callCount++;
      return x;
    };
    
    const { memoized } = createClearableMemoize(fn, {
      maxSize: 1,
      keyResolver: x => `key_${x}`
    });
    
    memoized(1);
    memoized(2); // Should evict 1
    memoized(1); // Should recalculate
    
    expect(callCount).toBe(3);
  });
});