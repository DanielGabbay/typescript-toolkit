import {
  union,
  intersection,
  difference,
  symmetricDifference,
  isEqual,
  isEqualSet,
  isSubset,
  isSuperset,
  isDisjoint,
  cartesianProduct,
  powerSet,
  permutations,
  combinations
} from './set-operations';

describe('set operations utilities', () => {
  
  describe('union', () => {
    it('should return union of two arrays', () => {
      expect(union([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('should remove duplicates', () => {
      expect(union([1, 2, 2], [2, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle multiple arrays', () => {
      expect(union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty arrays', () => {
      expect(union([], [1, 2])).toEqual([1, 2]);
      expect(union([1, 2], [])).toEqual([1, 2]);
      expect(union([], [])).toEqual([]);
    });

    it('should handle no arguments', () => {
      expect(union()).toEqual([]);
    });

    it('should work with strings', () => {
      expect(union(['a', 'b'], ['b', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('intersection', () => {
    it('should return intersection of two arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should return empty array when no common elements', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it('should handle multiple arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
    });

    it('should handle empty arrays', () => {
      expect(intersection()).toEqual([]);
      expect(intersection([1, 2, 3])).toEqual([1, 2, 3]);
      expect(intersection([1, 2], [])).toEqual([]);
    });

    it('should preserve order from first array', () => {
      expect(intersection([3, 1, 2], [2, 3, 4])).toEqual([3, 2]);
    });

    it('should work with strings', () => {
      expect(intersection(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c']);
    });
  });

  describe('difference', () => {
    it('should return elements in first array but not in others', () => {
      expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    });

    it('should handle multiple arrays', () => {
      expect(difference([1, 2, 3, 4, 5], [2, 4], [5])).toEqual([1, 3]);
    });

    it('should return original array when no other arrays', () => {
      expect(difference([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      expect(difference([], [1, 2])).toEqual([]);
      expect(difference([1, 2], [])).toEqual([1, 2]);
    });

    it('should preserve order', () => {
      expect(difference([3, 1, 4, 2], [2, 4])).toEqual([3, 1]);
    });

    it('should work with strings', () => {
      expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
    });
  });

  describe('symmetricDifference', () => {
    it('should return elements that exist in only one array', () => {
      expect(symmetricDifference([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 4, 5]);
    });

    it('should return all elements when arrays are disjoint', () => {
      expect(symmetricDifference([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should return empty array when arrays are identical', () => {
      expect(symmetricDifference([1, 2, 3], [1, 2, 3])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(symmetricDifference([], [1, 2])).toEqual([1, 2]);
      expect(symmetricDifference([1, 2], [])).toEqual([1, 2]);
      expect(symmetricDifference([], [])).toEqual([]);
    });

    it('should work with strings', () => {
      expect(symmetricDifference(['a', 'b'], ['b', 'c'])).toEqual(['a', 'c']);
    });
  });

  describe('isEqual', () => {
    it('should return true for identical arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([], [])).toBe(true);
    });

    it('should return false for different arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should be order sensitive', () => {
      expect(isEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    });

    it('should work with strings', () => {
      expect(isEqual(['a', 'b'], ['a', 'b'])).toBe(true);
      expect(isEqual(['a', 'b'], ['b', 'a'])).toBe(false);
    });
  });

  describe('isEqualSet', () => {
    it('should return true for arrays with same elements', () => {
      expect(isEqualSet([1, 2, 3], [3, 2, 1])).toBe(true);
      expect(isEqualSet([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false for different arrays', () => {
      expect(isEqualSet([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqualSet([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should be order insensitive', () => {
      expect(isEqualSet([1, 2, 3], [3, 2, 1])).toBe(true);
    });

    it('should handle duplicates correctly', () => {
      expect(isEqualSet([1, 2, 2, 3], [3, 2, 1, 1])).toBe(true); // Same length when both have duplicates
      expect(isEqualSet([1, 1, 2], [2, 2, 1])).toBe(true); // Same length when both have duplicates
    });

    it('should work with strings', () => {
      expect(isEqualSet(['a', 'b'], ['b', 'a'])).toBe(true);
    });
  });

  describe('isSubset', () => {
    it('should return true when first array is subset of second', () => {
      expect(isSubset([1, 2], [1, 2, 3, 4])).toBe(true);
      expect(isSubset([], [1, 2, 3])).toBe(true);
      expect(isSubset([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false when first array is not subset', () => {
      expect(isSubset([1, 5], [1, 2, 3, 4])).toBe(false);
      expect(isSubset([1, 2, 3], [1, 2])).toBe(false);
    });

    it('should be order insensitive', () => {
      expect(isSubset([2, 1], [1, 2, 3])).toBe(true);
    });

    it('should work with strings', () => {
      expect(isSubset(['a', 'b'], ['a', 'b', 'c'])).toBe(true);
    });
  });

  describe('isSuperset', () => {
    it('should return true when first array is superset of second', () => {
      expect(isSuperset([1, 2, 3, 4], [1, 2])).toBe(true);
      expect(isSuperset([1, 2, 3], [])).toBe(true);
      expect(isSuperset([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it('should return false when first array is not superset', () => {
      expect(isSuperset([1, 2, 3, 4], [1, 5])).toBe(false);
      expect(isSuperset([1, 2], [1, 2, 3])).toBe(false);
    });

    it('should work with strings', () => {
      expect(isSuperset(['a', 'b', 'c'], ['a', 'b'])).toBe(true);
    });
  });

  describe('isDisjoint', () => {
    it('should return true when arrays have no common elements', () => {
      expect(isDisjoint([1, 2], [3, 4])).toBe(true);
      expect(isDisjoint([], [1, 2])).toBe(true);
      expect(isDisjoint([1, 2], [])).toBe(true);
    });

    it('should return false when arrays have common elements', () => {
      expect(isDisjoint([1, 2, 3], [3, 4, 5])).toBe(false);
      expect(isDisjoint([1, 2], [2, 3])).toBe(false);
    });

    it('should work with strings', () => {
      expect(isDisjoint(['a', 'b'], ['c', 'd'])).toBe(true);
      expect(isDisjoint(['a', 'b'], ['b', 'c'])).toBe(false);
    });
  });

  describe('cartesianProduct', () => {
    it('should return cartesian product of two arrays', () => {
      expect(cartesianProduct([1, 2], ['a', 'b'])).toEqual([
        [1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']
      ]);
    });

    it('should handle empty arrays', () => {
      expect(cartesianProduct([], [1, 2])).toEqual([]);
      expect(cartesianProduct([1, 2], [])).toEqual([]);
      expect(cartesianProduct([], [])).toEqual([]);
    });

    it('should handle single element arrays', () => {
      expect(cartesianProduct([1], ['a'])).toEqual([[1, 'a']]);
    });

    it('should preserve types', () => {
      const result = cartesianProduct([1, 2], ['a', 'b']);
      expect(result[0]).toEqual([1, 'a']);
      expect(typeof result[0][0]).toBe('number');
      expect(typeof result[0][1]).toBe('string');
    });
  });

  describe('powerSet', () => {
    it('should return all subsets of an array', () => {
      const result = powerSet([1, 2]);
      expect(result.sort()).toEqual([[], [1], [2], [1, 2]].sort());
    });

    it('should handle empty array', () => {
      expect(powerSet([])).toEqual([[]]);
    });

    it('should handle single element', () => {
      expect(powerSet([1])).toEqual([[], [1]]);
    });

    it('should return correct number of subsets', () => {
      expect(powerSet([1, 2, 3])).toHaveLength(8); // 2^3
      expect(powerSet([1, 2, 3, 4])).toHaveLength(16); // 2^4
    });

    it('should work with strings', () => {
      const result = powerSet(['a', 'b']);
      expect(result).toHaveLength(4);
      expect(result).toContainEqual([]);
      expect(result).toContainEqual(['a']);
      expect(result).toContainEqual(['b']);
      expect(result).toContainEqual(['a', 'b']);
    });
  });

  describe('permutations', () => {
    it('should return all permutations of an array', () => {
      const result = permutations([1, 2, 3]);
      expect(result).toHaveLength(6); // 3!
      expect(result).toContainEqual([1, 2, 3]);
      expect(result).toContainEqual([1, 3, 2]);
      expect(result).toContainEqual([2, 1, 3]);
      expect(result).toContainEqual([2, 3, 1]);
      expect(result).toContainEqual([3, 1, 2]);
      expect(result).toContainEqual([3, 2, 1]);
    });

    it('should handle empty array', () => {
      expect(permutations([])).toEqual([[]]);
    });

    it('should handle single element', () => {
      expect(permutations([1])).toEqual([[1]]);
    });

    it('should handle two elements', () => {
      const result = permutations([1, 2]);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual([1, 2]);
      expect(result).toContainEqual([2, 1]);
    });

    it('should work with strings', () => {
      const result = permutations(['a', 'b']);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(['a', 'b']);
      expect(result).toContainEqual(['b', 'a']);
    });
  });

  describe('combinations', () => {
    it('should return all k-combinations of an array', () => {
      const result = combinations([1, 2, 3, 4], 2);
      expect(result).toHaveLength(6); // C(4,2) = 6
      expect(result).toContainEqual([1, 2]);
      expect(result).toContainEqual([1, 3]);
      expect(result).toContainEqual([1, 4]);
      expect(result).toContainEqual([2, 3]);
      expect(result).toContainEqual([2, 4]);
      expect(result).toContainEqual([3, 4]);
    });

    it('should handle k = 0', () => {
      expect(combinations([1, 2, 3], 0)).toEqual([[]]);
    });

    it('should handle k = array length', () => {
      expect(combinations([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    });

    it('should return empty array when k > array length', () => {
      expect(combinations([1, 2], 3)).toEqual([]);
    });

    it('should handle single element combinations', () => {
      const result = combinations([1, 2, 3], 1);
      expect(result).toHaveLength(3);
      expect(result).toContainEqual([1]);
      expect(result).toContainEqual([2]);
      expect(result).toContainEqual([3]);
    });

    it('should work with strings', () => {
      const result = combinations(['a', 'b', 'c'], 2);
      expect(result).toHaveLength(3);
      expect(result).toContainEqual(['a', 'b']);
      expect(result).toContainEqual(['a', 'c']);
      expect(result).toContainEqual(['b', 'c']);
    });
  });
});
