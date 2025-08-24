/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  flatten,
  flattenDeep,
  flattenDepth,
  flattenBy,
  flattenFilter,
  flattenMap,
  zip,
  zipWith,
  unzip,
  interleave,
  transpose
} from './flatten';

describe('flatten', () => {
  it('should flatten array by one level', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
    expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, [3, 4]]);
  });

  it('should handle empty arrays', () => {
    expect(flatten([])).toEqual([]);
    expect(flatten([[], []])).toEqual([]);
  });
});

describe('flattenDeep', () => {
  it('should deep flatten all levels', () => {
    expect(flattenDeep([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
    expect(flattenDeep([[1, 2], [3, [4, 5]]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle mixed types', () => {
    expect(flattenDeep([1, ['a', [true, [null]]]])).toEqual([1, 'a', true, null]);
  });
});

describe('flattenDepth', () => {
  it('should flatten to specified depth', () => {
    expect(flattenDepth([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
    expect(flattenDepth([1, [2, [3, [4]]]], 1)).toEqual([1, 2, [3, [4]]]);
    expect(flattenDepth([1, [2, [3, [4]]]], 0)).toEqual([1, [2, [3, [4]]]]);
  });
});

describe('flattenBy', () => {
  it('should flatten by key function', () => {
    const users = [
      { name: 'John', hobbies: ['reading', 'gaming'] },
      { name: 'Jane', hobbies: ['cooking', 'traveling'] }
    ];
    
    const result = flattenBy(users, user => user.hobbies);
    expect(result).toEqual(['reading', 'gaming', 'cooking', 'traveling']);
  });

  it('should handle empty results from key function', () => {
    const items = [{ values: [] }, { values: [1, 2] }];
    const result = flattenBy(items, item => item.values);
    expect(result).toEqual([1, 2]);
  });
});

describe('flattenFilter', () => {
  it('should flatten and filter in one step', () => {
    const mixed = [1, [2, 3], 4, [5, 6]];
    const result = flattenFilter(mixed, x => x > 3);
    expect(result).toEqual([4, 5, 6]);
  });

  it('should work with type guards', () => {
    const mixed = [1, ['a', 2], 'b', [3, 'c']];
    const result = flattenFilter(mixed, (x): x is string => typeof x === 'string');
    expect(result).toEqual(['a', 'b', 'c']);
  });
});

describe('flattenMap', () => {
  it('should flatten and map in one step', () => {
    const nested = [1, [2, 3], 4];
    const result = flattenMap(nested, x => x * 2);
    expect(result).toEqual([2, 4, 6, 8]);
  });

  it('should work with string transformation', () => {
    const words = ['hello', ['world', 'test']];
    const result = flattenMap(words, s => s.toUpperCase());
    expect(result).toEqual(['HELLO', 'WORLD', 'TEST']);
  });
});

describe('zip', () => {
  it('should zip two arrays', () => {
    expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ]);
  });

  it('should zip three arrays', () => {
    expect(zip([1, 2], ['a', 'b'], [true, false])).toEqual([
      [1, 'a', true],
      [2, 'b', false]
    ]);
  });

  it('should handle arrays of different lengths', () => {
    expect(zip([1, 2, 3], ['a'])).toEqual([
      [1, 'a'],
      [2],
      [3]
    ]);
  });

  it('should handle empty arrays', () => {
    expect(zip([])).toEqual([]);
    expect(zip([], [])).toEqual([]);
  });
});

describe('zipWith', () => {
  it('should zip with combiner function', () => {
    const result = zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b);
    expect(result).toEqual([5, 7, 9]);
  });

  it('should handle different length arrays', () => {
    const result = zipWith([1, 2, 3], [4, 5], (a, b) => a * b);
    expect(result).toEqual([4, 10]);
  });

  it('should work with string concatenation', () => {
    const result = zipWith(['a', 'b'], ['1', '2'], (a, b) => a + b);
    expect(result).toEqual(['a1', 'b2']);
  });
});

describe('unzip', () => {
  it('should unzip array of pairs', () => {
    const pairs: [number, string][] = [[1, 'a'], [2, 'b'], [3, 'c']];
    const [numbers, strings] = unzip(pairs);
    expect(numbers).toEqual([1, 2, 3]);
    expect(strings).toEqual(['a', 'b', 'c']);
  });

  it('should unzip array of triplets', () => {
    const triplets: [number, string, boolean][] = [[1, 'a', true], [2, 'b', false]];
    const [numbers, strings, booleans] = unzip(triplets);
    expect(numbers).toEqual([1, 2]);
    expect(strings).toEqual(['a', 'b']);
    expect(booleans).toEqual([true, false]);
  });

  it('should handle empty array', () => {
    expect(unzip([])).toEqual([]);
  });

  it('should handle tuples of different lengths', () => {
    const mixed = [[1, 'a'], [2, 'b', true], [3]];
    const result = unzip(mixed);
    expect(result).toEqual([[1, 2, 3], ['a', 'b'], [true]]);
  });
});

describe('interleave', () => {
  it('should interleave multiple arrays', () => {
    expect(interleave([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should handle arrays of different lengths', () => {
    expect(interleave([1, 3], [2, 4, 6], [10])).toEqual([1, 2, 10, 3, 4, 6]);
  });

  it('should handle empty arrays', () => {
    expect(interleave([])).toEqual([]);
    expect(interleave([], [1, 2])).toEqual([1, 2]);
  });

  it('should handle single array', () => {
    expect(interleave([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe('transpose', () => {
  it('should transpose 2D matrix', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6]
    ];
    expect(transpose(matrix)).toEqual([
      [1, 4],
      [2, 5],
      [3, 6]
    ]);
  });

  it('should handle empty matrix', () => {
    expect(transpose([])).toEqual([]);
  });

  it('should handle single row', () => {
    expect(transpose([[1, 2, 3]])).toEqual([[1], [2], [3]]);
  });

  it('should handle single column', () => {
    expect(transpose([[1], [2], [3]])).toEqual([[1, 2, 3]]);
  });

  it('should handle ragged arrays', () => {
    const matrix = [
      [1, 2],
      [3, 4, 5],
      [6]
    ];
    expect(transpose(matrix)).toEqual([
      [1, 3, 6],
      [2, 4],
      [5]
    ]);
  });
});