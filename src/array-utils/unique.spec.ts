/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  unique,
  uniqueBy,
  uniqueWith,
  duplicates,
  duplicatesBy,
  countBy,
  mostFrequent,
  leastFrequent
} from './unique';

describe('unique', () => {
  it('should remove duplicates from primitive array', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    expect(unique([true, false, true])).toEqual([true, false]);
  });

  it('should handle empty arrays', () => {
    expect(unique([])).toEqual([]);
  });

  it('should handle arrays with no duplicates', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe('uniqueBy', () => {
  it('should remove duplicates by key function', () => {
    const objects = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'Jack' }
    ];
    
    const result = uniqueBy(objects, obj => obj.id);
    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]);
  });

  it('should work with string key function', () => {
    const words = ['hello', 'world', 'hi', 'world'];
    const result = uniqueBy(words, word => word.toLowerCase());
    expect(result).toEqual(['hello', 'world', 'hi']);
  });

  it('should handle empty arrays', () => {
    expect(uniqueBy([], x => x)).toEqual([]);
  });
});

describe('uniqueWith', () => {
  it('should remove duplicates using custom equality function', () => {
    const objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 2 }
    ];
    
    const result = uniqueWith(objects, (a, b) => a.x === b.x && a.y === b.y);
    expect(result).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 1 }
    ]);
  });

  it('should handle case-insensitive string comparison', () => {
    const strings = ['Hello', 'world', 'HELLO', 'World'];
    const result = uniqueWith(strings, (a, b) => a.toLowerCase() === b.toLowerCase());
    expect(result).toEqual(['Hello', 'world']);
  });
});

describe('duplicates', () => {
  it('should find duplicate values', () => {
    expect(duplicates([1, 2, 2, 3, 1])).toEqual([2, 1]);
    expect(duplicates(['a', 'b', 'a', 'c'])).toEqual(['a']);
  });

  it('should return empty array when no duplicates', () => {
    expect(duplicates([1, 2, 3])).toEqual([]);
  });

  it('should handle empty arrays', () => {
    expect(duplicates([])).toEqual([]);
  });
});

describe('duplicatesBy', () => {
  it('should find duplicates by key function', () => {
    const objects = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'Jack' },
      { id: 3, name: 'Jill' }
    ];
    
    const result = duplicatesBy(objects, obj => obj.id);
    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 1, name: 'Jack' }
    ]);
  });

  it('should return empty array when no duplicates by key', () => {
    const objects = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    
    expect(duplicatesBy(objects, obj => obj.id)).toEqual([]);
  });
});

describe('countBy', () => {
  it('should count occurrences without key function', () => {
    const result = countBy([1, 2, 2, 3, 1]);
    expect(result.get(1)).toBe(2);
    expect(result.get(2)).toBe(2);
    expect(result.get(3)).toBe(1);
  });

  it('should count occurrences with key function', () => {
    const objects = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 }
    ];
    
    const result = countBy(objects, obj => obj.type);
    expect(result.get('a')).toBe(2);
    expect(result.get('b')).toBe(1);
  });

  it('should handle empty arrays', () => {
    const result = countBy([]);
    expect(result.size).toBe(0);
  });
});

describe('mostFrequent', () => {
  it('should find most frequent elements', () => {
    expect(mostFrequent([1, 2, 2, 3, 1])).toEqual([1, 2]);
    expect(mostFrequent([1, 1, 1, 2, 3])).toEqual([1]);
    expect(mostFrequent(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('should handle empty arrays', () => {
    expect(mostFrequent([])).toEqual([]);
  });

  it('should handle single element', () => {
    expect(mostFrequent([1])).toEqual([1]);
  });
});

describe('leastFrequent', () => {
  it('should find least frequent elements', () => {
    expect(leastFrequent([1, 1, 1, 2, 3])).toEqual([2, 3]);
    expect(leastFrequent([1, 2, 2, 3, 1])).toEqual([3]);
    expect(leastFrequent(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('should handle empty arrays', () => {
    expect(leastFrequent([])).toEqual([]);
  });

  it('should handle single element', () => {
    expect(leastFrequent([1])).toEqual([1]);
  });
});