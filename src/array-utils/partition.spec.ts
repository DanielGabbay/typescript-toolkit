/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  partition,
  partitionMultiple,
  headTail,
  initLast,
  takeWhile,
  dropWhile,
  takeRightWhile,
  dropRightWhile,
  take,
  drop,
  takeRight,
  dropRight,
  splitWhen,
  extract
} from './partition';

describe('partition', () => {
  it('should partition array based on predicate', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const [evens, odds] = partition(numbers, n => n % 2 === 0);
    expect(evens).toEqual([2, 4, 6]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it('should work with type guards', () => {
    const mixed = [1, 'a', 2, 'b', 3];
    const [strings, numbers] = partition(mixed, (x): x is string => typeof x === 'string');
    expect(strings).toEqual(['a', 'b']);
    expect(numbers).toEqual([1, 2, 3]);
  });

  it('should handle all true predicate', () => {
    const [truthy, falsy] = partition([1, 2, 3], () => true);
    expect(truthy).toEqual([1, 2, 3]);
    expect(falsy).toEqual([]);
  });

  it('should handle all false predicate', () => {
    const [truthy, falsy] = partition([1, 2, 3], () => false);
    expect(truthy).toEqual([]);
    expect(falsy).toEqual([1, 2, 3]);
  });
});

describe('partitionMultiple', () => {
  it('should partition into multiple groups', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = partitionMultiple(
      numbers,
      n => n % 3 === 0, // divisible by 3
      n => n % 2 === 0  // even (but not divisible by 3)
    );
    
    expect(result[0]).toEqual([3, 6, 9]); // divisible by 3
    expect(result[1]).toEqual([2, 4, 8]); // even but not divisible by 3
    expect(result[2]).toEqual([1, 5, 7]); // remainder (odd and not divisible by 3)
  });

  it('should handle no predicates', () => {
    const result = partitionMultiple([1, 2, 3]);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should handle empty array', () => {
    const result = partitionMultiple([], x => x > 0);
    expect(result).toEqual([[], []]);
  });
});

describe('headTail', () => {
  it('should split array into head and tail', () => {
    expect(headTail([1, 2, 3, 4])).toEqual([1, [2, 3, 4]]);
    expect(headTail(['a'])).toEqual(['a', []]);
  });

  it('should handle empty array', () => {
    expect(headTail([])).toEqual([undefined, []]);
  });
});

describe('initLast', () => {
  it('should split array into init and last', () => {
    expect(initLast([1, 2, 3, 4])).toEqual([[1, 2, 3], 4]);
    expect(initLast(['a'])).toEqual([[], 'a']);
  });

  it('should handle empty array', () => {
    expect(initLast([])).toEqual([[], undefined]);
  });
});

describe('takeWhile', () => {
  it('should take elements while predicate is true', () => {
    expect(takeWhile([1, 2, 3, 4, 1], x => x < 4)).toEqual([1, 2, 3]);
    expect(takeWhile([2, 4, 6, 1, 8], x => x % 2 === 0)).toEqual([2, 4, 6]);
  });

  it('should include index in predicate', () => {
    const result = takeWhile([10, 20, 30, 40], (x, i) => i < 2);
    expect(result).toEqual([10, 20]);
  });

  it('should return empty array if first element fails', () => {
    expect(takeWhile([4, 1, 2, 3], x => x < 4)).toEqual([]);
  });

  it('should return all elements if predicate always true', () => {
    expect(takeWhile([1, 2, 3], () => true)).toEqual([1, 2, 3]);
  });
});

describe('dropWhile', () => {
  it('should drop elements while predicate is true', () => {
    expect(dropWhile([1, 2, 3, 4, 1], x => x < 4)).toEqual([4, 1]);
    expect(dropWhile([2, 4, 6, 1, 8], x => x % 2 === 0)).toEqual([1, 8]);
  });

  it('should include index in predicate', () => {
    const result = dropWhile([10, 20, 30, 40], (x, i) => i < 2);
    expect(result).toEqual([30, 40]);
  });

  it('should return original array if first element fails', () => {
    expect(dropWhile([4, 1, 2, 3], x => x < 4)).toEqual([4, 1, 2, 3]);
  });

  it('should return empty array if predicate always true', () => {
    expect(dropWhile([1, 2, 3], () => true)).toEqual([]);
  });
});

describe('takeRightWhile', () => {
  it('should take elements from right while predicate is true', () => {
    expect(takeRightWhile([1, 2, 3, 4], x => x > 2)).toEqual([3, 4]);
    expect(takeRightWhile([1, 3, 5, 2, 4], x => x % 2 === 0)).toEqual([2, 4]);
  });

  it('should return empty array if last element fails', () => {
    expect(takeRightWhile([1, 2, 3, 4], x => x > 4)).toEqual([]);
  });
});

describe('dropRightWhile', () => {
  it('should drop elements from right while predicate is true', () => {
    expect(dropRightWhile([1, 2, 3, 4], x => x > 2)).toEqual([1, 2]);
    expect(dropRightWhile([1, 3, 5, 2, 4], x => x % 2 === 0)).toEqual([1, 3, 5]);
  });

  it('should return original array if last element fails', () => {
    expect(dropRightWhile([1, 2, 3, 4], x => x > 4)).toEqual([1, 2, 3, 4]);
  });
});

describe('take', () => {
  it('should take n elements from beginning', () => {
    expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    expect(take(['a', 'b', 'c'], 2)).toEqual(['a', 'b']);
  });

  it('should handle n larger than array length', () => {
    expect(take([1, 2], 5)).toEqual([1, 2]);
  });

  it('should handle negative n', () => {
    expect(take([1, 2, 3], -1)).toEqual([]);
  });

  it('should handle zero', () => {
    expect(take([1, 2, 3], 0)).toEqual([]);
  });
});

describe('drop', () => {
  it('should drop n elements from beginning', () => {
    expect(drop([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5]);
    expect(drop(['a', 'b', 'c'], 1)).toEqual(['b', 'c']);
  });

  it('should handle n larger than array length', () => {
    expect(drop([1, 2], 5)).toEqual([]);
  });

  it('should handle negative n', () => {
    expect(drop([1, 2, 3], -1)).toEqual([1, 2, 3]);
  });
});

describe('takeRight', () => {
  it('should take n elements from end', () => {
    expect(takeRight([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
    expect(takeRight(['a', 'b', 'c'], 2)).toEqual(['b', 'c']);
  });

  it('should handle n larger than array length', () => {
    expect(takeRight([1, 2], 5)).toEqual([1, 2]);
  });

  it('should handle zero', () => {
    expect(takeRight([1, 2, 3], 0)).toEqual([]);
  });
});

describe('dropRight', () => {
  it('should drop n elements from end', () => {
    expect(dropRight([1, 2, 3, 4, 5], 2)).toEqual([1, 2, 3]);
    expect(dropRight(['a', 'b', 'c'], 1)).toEqual(['a', 'b']);
  });

  it('should handle n larger than array length', () => {
    expect(dropRight([1, 2], 5)).toEqual([]);
  });

  it('should handle zero', () => {
    expect(dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
});

describe('splitWhen', () => {
  it('should split at first matching element', () => {
    expect(splitWhen([1, 2, 3, 4, 5], x => x === 3)).toEqual([[1, 2], [3, 4, 5]]);
    expect(splitWhen(['a', 'b', 'c'], x => x === 'b')).toEqual([['a'], ['b', 'c']]);
  });

  it('should include index in predicate', () => {
    const result = splitWhen([10, 20, 30, 40], (x, i) => i === 2);
    expect(result).toEqual([[10, 20], [30, 40]]);
  });

  it('should handle no match', () => {
    expect(splitWhen([1, 2, 3], x => x === 5)).toEqual([[1, 2, 3], []]);
  });

  it('should handle match at beginning', () => {
    expect(splitWhen([1, 2, 3], x => x === 1)).toEqual([[], [1, 2, 3]]);
  });
});

describe('extract', () => {
  it('should extract elements between indices', () => {
    expect(extract([1, 2, 3, 4, 5], 1, 3)).toEqual([2, 3, 4]);
    expect(extract(['a', 'b', 'c', 'd'], 0, 1)).toEqual(['a', 'b']);
  });

  it('should handle negative indices', () => {
    expect(extract([1, 2, 3, 4, 5], -3, -1)).toEqual([3, 4, 5]);
    expect(extract([1, 2, 3, 4, 5], -2)).toEqual([4, 5]);
  });

  it('should handle out-of-bounds indices', () => {
    expect(extract([1, 2, 3], -5, 10)).toEqual([1, 2, 3]);
    expect(extract([1, 2, 3], 5, 10)).toEqual([]);
  });

  it('should handle omitted end index', () => {
    expect(extract([1, 2, 3, 4, 5], 2)).toEqual([3, 4, 5]);
  });

  it('should handle start greater than end', () => {
    expect(extract([1, 2, 3, 4, 5], 3, 1)).toEqual([]);
  });
});