import {
  binarySearch,
  binarySearchInsertionPoint,
  findIndex,
  findLastIndex,
  findAllIndices,
  stableSort,
  sortBy,
  sortByCriteria,
  topK,
  kthElement,
  isSorted,
  mergeSorted,
  insertionSort,
  type SortCriterion
} from './search-sort';

describe('search and sort utilities', () => {
  
  describe('binarySearch', () => {
    const sortedNumbers = [1, 3, 5, 7, 9, 11, 13];
    
    it('should find existing elements', () => {
      expect(binarySearch(sortedNumbers, 5)).toBe(2);
      expect(binarySearch(sortedNumbers, 1)).toBe(0);
      expect(binarySearch(sortedNumbers, 13)).toBe(6);
    });

    it('should return -1 for non-existing elements', () => {
      expect(binarySearch(sortedNumbers, 4)).toBe(-1);
      expect(binarySearch(sortedNumbers, 0)).toBe(-1);
      expect(binarySearch(sortedNumbers, 15)).toBe(-1);
    });

    it('should work with custom compare function', () => {
      const sortedStrings = ['apple', 'banana', 'cherry', 'date'];
      const caseInsensitiveCompare = (a: string, b: string) =>
        a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0;
      
      expect(binarySearch(sortedStrings, 'BANANA', caseInsensitiveCompare)).toBe(1);
      expect(binarySearch(sortedStrings, 'grape', caseInsensitiveCompare)).toBe(-1);
    });

    it('should handle empty array', () => {
      expect(binarySearch([], 5)).toBe(-1);
    });

    it('should handle single element array', () => {
      expect(binarySearch([5], 5)).toBe(0);
      expect(binarySearch([5], 3)).toBe(-1);
    });
  });

  describe('binarySearchInsertionPoint', () => {
    const sortedNumbers = [1, 3, 5, 7, 9];
    
    it('should find correct insertion points', () => {
      expect(binarySearchInsertionPoint(sortedNumbers, 0)).toBe(0);
      expect(binarySearchInsertionPoint(sortedNumbers, 2)).toBe(1);
      expect(binarySearchInsertionPoint(sortedNumbers, 6)).toBe(3);
      expect(binarySearchInsertionPoint(sortedNumbers, 10)).toBe(5);
    });

    it('should handle existing elements', () => {
      expect(binarySearchInsertionPoint(sortedNumbers, 5)).toBe(2);
      expect(binarySearchInsertionPoint(sortedNumbers, 1)).toBe(0);
    });

    it('should work with custom compare function', () => {
      const sortedStrings = ['a', 'c', 'e'];
      const compare = (a: string, b: string) => a.localeCompare(b);
      
      expect(binarySearchInsertionPoint(sortedStrings, 'b', compare)).toBe(1);
      expect(binarySearchInsertionPoint(sortedStrings, 'd', compare)).toBe(2);
    });

    it('should handle empty array', () => {
      expect(binarySearchInsertionPoint([], 5)).toBe(0);
    });
  });

  describe('findIndex', () => {
    const numbers = [1, 2, 3, 4, 3, 5];
    
    it('should find first matching element', () => {
      expect(findIndex(numbers, x => x === 3)).toBe(2);
      expect(findIndex(numbers, x => x > 4)).toBe(5);
    });

    it('should return -1 when no element matches', () => {
      expect(findIndex(numbers, x => x > 10)).toBe(-1);
    });

    it('should support start index', () => {
      expect(findIndex(numbers, x => x === 3, 3)).toBe(4);
      expect(findIndex(numbers, x => x === 1, 1)).toBe(-1);
    });

    it('should pass index to predicate', () => {
      const result = findIndex(['a', 'b', 'c'], (_item, index) => index === 1);
      expect(result).toBe(1);
    });

    it('should handle empty array', () => {
      expect(findIndex([], () => true)).toBe(-1);
    });
  });

  describe('findLastIndex', () => {
    const numbers = [1, 2, 3, 4, 3, 5];
    
    it('should find last matching element', () => {
      expect(findLastIndex(numbers, x => x === 3)).toBe(4);
      expect(findLastIndex(numbers, x => x < 4)).toBe(4); // Last element < 4 is at index 4 (value 3)
    });

    it('should return -1 when no element matches', () => {
      expect(findLastIndex(numbers, x => x > 10)).toBe(-1);
    });

    it('should support start index', () => {
      expect(findLastIndex(numbers, x => x === 3, 3)).toBe(2);
      expect(findLastIndex(numbers, x => x === 5, 2)).toBe(-1);
    });

    it('should handle empty array', () => {
      expect(findLastIndex([], () => true)).toBe(-1);
    });
  });

  describe('findAllIndices', () => {
    const numbers = [1, 2, 3, 2, 4, 2];
    
    it('should find all matching indices', () => {
      expect(findAllIndices(numbers, x => x === 2)).toEqual([1, 3, 5]);
      expect(findAllIndices(numbers, x => x > 3)).toEqual([4]);
    });

    it('should return empty array when no matches', () => {
      expect(findAllIndices(numbers, x => x > 10)).toEqual([]);
    });

    it('should pass index to predicate', () => {
      const result = findAllIndices(['a', 'b', 'c'], (_item, index) => index % 2 === 0);
      expect(result).toEqual([0, 2]);
    });

    it('should handle empty array', () => {
      expect(findAllIndices([], () => true)).toEqual([]);
    });
  });

  describe('stableSort', () => {
    interface Item {
      value: number;
      id: string;
    }

    const items: Item[] = [
      { value: 3, id: 'a' },
      { value: 1, id: 'b' },
      { value: 3, id: 'c' },
      { value: 2, id: 'd' }
    ];

    it('should maintain stable order for equal elements', () => {
      const result = stableSort(items, (a, b) => a.value - b.value);
      
      expect(result.map(item => item.id)).toEqual(['b', 'd', 'a', 'c']);
      expect(result[2].id).toBe('a'); // First item with value 3
      expect(result[3].id).toBe('c'); // Second item with value 3
    });

    it('should sort correctly', () => {
      const numbers = [3, 1, 4, 1, 5];
      const result = stableSort(numbers, (a, b) => a - b);
      expect(result).toEqual([1, 1, 3, 4, 5]);
    });

    it('should handle empty array', () => {
      expect(stableSort([], (a, b) => a - b)).toEqual([]);
    });
  });

  describe('sortBy', () => {
    const people = [
      { name: 'John', age: 30, city: 'NYC' },
      { name: 'Alice', age: 25, city: 'LA' },
      { name: 'Bob', age: 30, city: 'Chicago' }
    ];

    it('should sort by single key', () => {
      const result = sortBy(people, p => p.age);
      expect(result.map(p => p.name)).toEqual(['Alice', 'John', 'Bob']);
    });

    it('should sort by multiple keys', () => {
      const result = sortBy(people, p => p.age, p => p.name);
      expect(result.map(p => p.name)).toEqual(['Alice', 'Bob', 'John']);
    });

    it('should handle different data types', () => {
      const mixed = [
        { str: 'b', num: 2 },
        { str: 'a', num: 3 },
        { str: 'b', num: 1 }
      ];
      const result = sortBy(mixed, m => m.str, m => m.num);
      expect(result).toEqual([
        { str: 'a', num: 3 },
        { str: 'b', num: 1 },
        { str: 'b', num: 2 }
      ]);
    });

    it('should handle empty array', () => {
      expect(sortBy([], x => x)).toEqual([]);
    });
  });

  describe('sortByCriteria', () => {
    const people = [
      { name: 'John', age: 30, salary: 50000 },
      { name: 'Alice', age: 25, salary: 60000 },
      { name: 'Bob', age: 30, salary: 45000 }
    ];

    it('should sort by single criterion', () => {
      const criteria: SortCriterion<typeof people[0]>[] = [
        { keyFn: p => p.age }
      ];
      const result = sortByCriteria(people, criteria);
      expect(result.map(p => p.name)).toEqual(['Alice', 'John', 'Bob']);
    });

    it('should sort by multiple criteria with directions', () => {
      const criteria: SortCriterion<typeof people[0]>[] = [
        { keyFn: p => p.age, direction: 'desc' },
        { keyFn: p => p.salary, direction: 'asc' }
      ];
      const result = sortByCriteria(people, criteria);
      expect(result.map(p => p.name)).toEqual(['Bob', 'John', 'Alice']);
    });

    it('should default to ascending order', () => {
      const criteria: SortCriterion<typeof people[0]>[] = [
        { keyFn: p => p.age }
      ];
      const result = sortByCriteria(people, criteria);
      expect(result[0].age).toBeLessThanOrEqual(result[1].age);
    });

    it('should handle empty criteria', () => {
      const result = sortByCriteria(people, []);
      expect(result).toEqual(people);
    });
  });

  describe('topK', () => {
    const numbers = [3, 1, 4, 1, 5, 9, 2, 6];

    it('should return top K elements', () => {
      const result = topK(numbers, 3);
      expect(result.sort((a, b) => b - a)).toEqual([9, 6, 5]);
      expect(result).toHaveLength(3);
    });

    it('should handle K >= array length', () => {
      const result = topK(numbers, 10);
      expect(result).toHaveLength(numbers.length);
      expect(result.sort((a, b) => a - b)).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should handle K <= 0', () => {
      expect(topK(numbers, 0)).toEqual([]);
      expect(topK(numbers, -1)).toEqual([]);
    });

    it('should work with custom compare function', () => {
      const strings = ['apple', 'pie', 'a', 'longer'];
      const result = topK(strings, 2, (a, b) => a.length - b.length);
      expect(result.sort((a, b) => b.length - a.length)).toEqual(['longer', 'apple']);
    });

    it('should handle empty array', () => {
      expect(topK([], 3)).toEqual([]);
    });
  });

  describe('kthElement', () => {
    const numbers = [3, 1, 4, 1, 5, 9, 2, 6];

    it('should find kth smallest element', () => {
      expect(kthElement(numbers, 1)).toBe(1);
      expect(kthElement(numbers, 4)).toBe(3);
      expect(kthElement(numbers, 8)).toBe(9);
    });

    it('should return undefined for invalid k', () => {
      expect(kthElement(numbers, 0)).toBeUndefined();
      expect(kthElement(numbers, 9)).toBeUndefined();
      expect(kthElement(numbers, -1)).toBeUndefined();
    });

    it('should work with custom compare function', () => {
      const strings = ['apple', 'pie', 'a'];
      const result = kthElement(strings, 2, (a, b) => a.length - b.length);
      expect(result).toBe('pie');
    });

    it('should handle single element', () => {
      expect(kthElement([42], 1)).toBe(42);
    });
  });

  describe('isSorted', () => {
    it('should return true for sorted arrays', () => {
      expect(isSorted([1, 2, 3, 4, 5])).toBe(true);
      expect(isSorted([1, 1, 2, 2, 3])).toBe(true);
      expect(isSorted(['a', 'b', 'c'])).toBe(true);
    });

    it('should return false for unsorted arrays', () => {
      expect(isSorted([1, 3, 2, 4])).toBe(false);
      expect(isSorted([5, 4, 3, 2, 1])).toBe(false);
    });

    it('should work with custom compare function', () => {
      const descending = [5, 4, 3, 2, 1];
      expect(isSorted(descending, (a, b) => b - a)).toBe(true);
      expect(isSorted([1, 2, 3], (a, b) => b - a)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isSorted([])).toBe(true);
      expect(isSorted([1])).toBe(true);
      expect(isSorted([1, 1, 1])).toBe(true);
    });
  });

  describe('mergeSorted', () => {
    it('should merge two sorted arrays', () => {
      const arr1 = [1, 3, 5];
      const arr2 = [2, 4, 6];
      expect(mergeSorted(arr1, arr2)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle arrays of different lengths', () => {
      const arr1 = [1, 5, 9];
      const arr2 = [2, 3, 4, 6, 7, 8];
      expect(mergeSorted(arr1, arr2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should handle empty arrays', () => {
      expect(mergeSorted([], [1, 2, 3])).toEqual([1, 2, 3]);
      expect(mergeSorted([1, 2, 3], [])).toEqual([1, 2, 3]);
      expect(mergeSorted([], [])).toEqual([]);
    });

    it('should handle duplicate elements', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [2, 3, 4];
      expect(mergeSorted(arr1, arr2)).toEqual([1, 2, 2, 3, 3, 4]);
    });

    it('should work with custom compare function', () => {
      // Pre-sorted by length: date(4) < apple(5) < banana(6) = cherry(6)
      const arr1 = ['date', 'apple']; // sorted by length
      const arr2 = ['banana', 'cherry']; // sorted by length
      const result = mergeSorted(arr1, arr2, (a, b) => a.length - b.length);
      expect(result).toEqual(['date', 'apple', 'banana', 'cherry']);
    });
  });

  describe('insertionSort', () => {
    it('should sort array using insertion sort', () => {
      const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
      expect(insertionSort(numbers)).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
    });

    it('should not mutate original array', () => {
      const original = [3, 1, 4];
      const sorted = insertionSort(original);
      expect(original).toEqual([3, 1, 4]);
      expect(sorted).toEqual([1, 3, 4]);
    });

    it('should work with custom compare function', () => {
      const numbers = [1, 2, 3, 4, 5];
      const descending = insertionSort(numbers, (a, b) => b - a);
      expect(descending).toEqual([5, 4, 3, 2, 1]);
    });

    it('should handle edge cases', () => {
      expect(insertionSort([])).toEqual([]);
      expect(insertionSort([1])).toEqual([1]);
      expect(insertionSort([1, 1, 1])).toEqual([1, 1, 1]);
    });

    it('should be stable', () => {
      interface Item {
        value: number;
        id: string;
      }
      
      const items: Item[] = [
        { value: 2, id: 'a' },
        { value: 1, id: 'b' },
        { value: 2, id: 'c' }
      ];
      
      const sorted = insertionSort(items, (a, b) => a.value - b.value);
      expect(sorted[1].id).toBe('a'); // First item with value 2
      expect(sorted[2].id).toBe('c'); // Second item with value 2
    });
  });
});
