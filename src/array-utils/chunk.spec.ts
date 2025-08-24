/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  chunk,
  chunkInto,
  splitAt,
  splitBy,
  splitOn,
  slidingWindow,
  slidingWindowStep,
  batch
} from './chunk';

describe('chunk', () => {
  it('should split array into chunks of specified size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]);
  });

  it('should handle chunk size larger than array', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it('should handle empty array', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it('should throw error for invalid chunk size', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be greater than 0');
    expect(() => chunk([1, 2, 3], -1)).toThrow('Chunk size must be greater than 0');
  });
});

describe('chunkInto', () => {
  it('should split array into specified number of chunks', () => {
    expect(chunkInto([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2, 3], [4, 5, 6]]);
    expect(chunkInto([1, 2, 3, 4, 5], 3)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should handle more chunks than elements', () => {
    expect(chunkInto([1, 2], 5)).toEqual([[1], [2]]);
  });

  it('should throw error for invalid number of chunks', () => {
    expect(() => chunkInto([1, 2, 3], 0)).toThrow('Number of chunks must be greater than 0');
    expect(() => chunkInto([1, 2, 3], -1)).toThrow('Number of chunks must be greater than 0');
  });
});

describe('splitAt', () => {
  it('should split array at specified indices', () => {
    expect(splitAt([1, 2, 3, 4, 5], 2, 4)).toEqual([[1, 2], [3, 4], [5]]);
    expect(splitAt(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
  });

  it('should handle duplicate indices', () => {
    expect(splitAt([1, 2, 3, 4], 2, 2)).toEqual([[1, 2], [3, 4]]);
  });

  it('should handle out-of-bounds indices', () => {
    expect(splitAt([1, 2, 3], 5, 10)).toEqual([[1, 2, 3]]);
  });

  it('should handle unsorted indices', () => {
    expect(splitAt([1, 2, 3, 4, 5], 4, 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe('splitBy', () => {
  it('should split array by predicate', () => {
    const isEven = (x: number) => x % 2 === 0;
    expect(splitBy([1, 3, 2, 4, 5, 7], isEven)).toEqual([[1, 3], [5, 7]]);
  });

  it('should handle empty result chunks', () => {
    const isEven = (x: number) => x % 2 === 0;
    expect(splitBy([2, 4, 1, 3], isEven)).toEqual([[1, 3]]);
  });

  it('should include index in predicate', () => {
    const result = splitBy([1, 2, 3, 4, 5], (_, index) => index === 2);
    expect(result).toEqual([[1, 2], [4, 5]]);
  });
});

describe('splitOn', () => {
  it('should split array on separator value', () => {
    expect(splitOn([1, 2, 0, 3, 4, 0, 5], 0)).toEqual([[1, 2], [3, 4], [5]]);
    expect(splitOn(['a', 'b', '|', 'c', 'd'], '|')).toEqual([['a', 'b'], ['c', 'd']]);
  });

  it('should handle consecutive separators', () => {
    expect(splitOn([1, 0, 0, 2, 3], 0)).toEqual([[1], [2, 3]]);
  });
});

describe('slidingWindow', () => {
  it('should create sliding windows', () => {
    expect(slidingWindow([1, 2, 3, 4, 5], 3)).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  it('should handle window size equal to array length', () => {
    expect(slidingWindow([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  it('should handle window size larger than array', () => {
    expect(slidingWindow([1, 2], 5)).toEqual([[1, 2]]);
  });

  it('should handle empty array', () => {
    expect(slidingWindow([], 2)).toEqual([]);
  });

  it('should throw error for invalid window size', () => {
    expect(() => slidingWindow([1, 2, 3], 0)).toThrow('Window size must be greater than 0');
  });
});

describe('slidingWindowStep', () => {
  it('should create sliding windows with step', () => {
    expect(slidingWindowStep([1, 2, 3, 4, 5, 6], 3, 2)).toEqual([
      [1, 2, 3],
      [3, 4, 5]
    ]);
  });

  it('should default to step 1', () => {
    expect(slidingWindowStep([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4]
    ]);
  });

  it('should throw errors for invalid parameters', () => {
    expect(() => slidingWindowStep([1, 2, 3], 0, 1)).toThrow('Window size must be greater than 0');
    expect(() => slidingWindowStep([1, 2, 3], 2, 0)).toThrow('Step must be greater than 0');
  });
});

describe('batch', () => {
  it('should batch array elements with max size', () => {
    expect(batch([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should use batch condition', () => {
    const numbers = [1, 2, 3, 10, 11, 12];
    const condition = (item: number, currentBatch: number[]) => {
      return currentBatch.length === 0 || Math.abs(item - currentBatch[currentBatch.length - 1]) <= 5;
    };
    
    expect(batch(numbers, 10, condition)).toEqual([[1, 2, 3], [10, 11, 12]]);
  });

  it('should respect max batch size even with condition', () => {
    const condition = () => true; // Always allow
    expect(batch([1, 2, 3, 4, 5], 2, condition)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should throw error for invalid max batch size', () => {
    expect(() => batch([1, 2, 3], 0)).toThrow('Max batch size must be greater than 0');
  });
});