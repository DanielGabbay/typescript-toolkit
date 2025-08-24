import {
  get,
  set,
  has,
  unset,
  setImmutable,
  update,
  updateImmutable,
  at,
  setMultiple,
  transformAt
} from './path-operations';

describe('path operations utilities', () => {
  
  describe('get', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      arr: [1, 2, { x: 'nested' }],
      nullValue: null,
      undefinedValue: undefined
    };

    it('should get nested value with dot notation', () => {
      expect(get(obj, 'a.b.c')).toBe('value');
      expect(get(obj, 'a.b')).toEqual({ c: 'value' });
    });

    it('should get array values', () => {
      expect(get(obj, 'arr[0]')).toBe(1);
      expect(get(obj, 'arr[2].x')).toBe('nested');
    });

    it('should return default value for non-existent paths', () => {
      expect(get(obj, 'a.b.d', 'default')).toBe('default');
      expect(get(obj, 'nonexistent', 'default')).toBe('default');
    });

    it('should handle array path notation', () => {
      expect(get(obj, ['a', 'b', 'c'])).toBe('value');
      expect(get(obj, ['arr', 0])).toBe(1);
    });

    it('should handle null and undefined values', () => {
      expect(get(obj, 'nullValue')).toBeNull();
      expect(get(obj, 'undefinedValue')).toBeUndefined();
      expect(get(obj, 'undefinedValue', 'default')).toBe('default');
    });

    it('should handle invalid objects', () => {
      expect(get(null, 'a.b', 'default')).toBe('default');
      expect(get(undefined, 'a.b', 'default')).toBe('default');
      expect(get('string', 'a.b', 'default')).toBe('default');
    });

    it('should handle deep null traversal', () => {
      const objWithNull = { a: { b: null } };
      expect(get(objWithNull, 'a.b.c', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should set nested value', () => {
      const obj = { a: {} };
      set(obj, 'a.b.c', 'value');
      expect(obj).toEqual({ a: { b: { c: 'value' } } });
    });

    it('should create array for numeric keys', () => {
      const obj = {};
      set(obj, 'arr[0]', 'first');
      set(obj, 'arr[1]', 'second');
      expect(obj).toEqual({ arr: ['first', 'second'] });
    });

    it('should handle array path notation', () => {
      const obj = {};
      set(obj, ['a', 'b', 'c'], 'value');
      expect(obj).toEqual({ a: { b: { c: 'value' } } });
    });

    it('should overwrite existing values', () => {
      const obj = { a: { b: 'old' } };
      set(obj, 'a.b', 'new');
      expect(obj.a.b).toBe('new');
    });

    it('should create nested structure', () => {
      const obj = {};
      set(obj, 'deeply.nested.path', 'value');
      expect(obj).toEqual({
        deeply: {
          nested: {
            path: 'value'
          }
        }
      });
    });

    it('should handle mixed object and array paths', () => {
      const obj = {};
      set(obj, 'a.arr[0].b', 'value');
      expect(obj).toEqual({
        a: {
          arr: [{ b: 'value' }]
        }
      });
    });

    it('should return the same object', () => {
      const obj = {};
      const result = set(obj, 'a.b', 'value');
      expect(result).toBe(obj);
    });
  });

  describe('has', () => {
    const obj = {
      a: {
        b: {
          c: 'value'
        }
      },
      arr: [1, 2, { x: 'nested' }],
      nullValue: null,
      undefinedValue: undefined,
      zero: 0,
      false: false,
      empty: ''
    };

    it('should return true for existing paths', () => {
      expect(has(obj, 'a.b.c')).toBe(true);
      expect(has(obj, 'arr[0]')).toBe(true);
      expect(has(obj, 'arr[2].x')).toBe(true);
    });

    it('should return false for non-existent paths', () => {
      expect(has(obj, 'a.b.d')).toBe(false);
      expect(has(obj, 'nonexistent')).toBe(false);
      expect(has(obj, 'arr[5]')).toBe(false);
    });

    it('should return true for falsy but existing values', () => {
      expect(has(obj, 'nullValue')).toBe(true);
      expect(has(obj, 'undefinedValue')).toBe(true);
      expect(has(obj, 'zero')).toBe(true);
      expect(has(obj, 'false')).toBe(true);
      expect(has(obj, 'empty')).toBe(true);
    });

    it('should handle array path notation', () => {
      expect(has(obj, ['a', 'b', 'c'])).toBe(true);
      expect(has(obj, ['arr', 0])).toBe(true);
      expect(has(obj, ['nonexistent'])).toBe(false);
    });

    it('should handle invalid objects', () => {
      expect(has(null, 'a.b')).toBe(false);
      expect(has(undefined, 'a.b')).toBe(false);
      expect(has('string', 'a.b')).toBe(false);
    });
  });

  describe('unset', () => {
    it('should delete nested property', () => {
      const obj = { a: { b: { c: 'value', d: 'keep' } } };
      const result = unset(obj, 'a.b.c');
      expect(result).toBe(true);
      expect(obj).toEqual({ a: { b: { d: 'keep' } } });
    });

    it('should delete array element', () => {
      const obj = { arr: [1, 2, 3] };
      const result = unset(obj, 'arr[1]');
      expect(result).toBe(true);
      expect(obj.arr).toEqual([1, 3]);
    });

    it('should return false for non-existent paths', () => {
      const obj = { a: { b: 'value' } };
      expect(unset(obj, 'a.c')).toBe(false);
      expect(unset(obj, 'nonexistent')).toBe(false);
    });

    it('should handle array path notation', () => {
      const obj = { a: { b: { c: 'value' } } };
      const result = unset(obj, ['a', 'b', 'c']);
      expect(result).toBe(true);
      expect(obj).toEqual({ a: { b: {} } });
    });

    it('should handle invalid objects', () => {
      expect(unset(null as any, 'a.b')).toBe(false);
      expect(unset(undefined as any, 'a.b')).toBe(false);
      expect(unset('string' as any, 'a.b')).toBe(false);
    });

    it('should handle empty path', () => {
      const obj = { a: 'value' };
      expect(unset(obj, '')).toBe(false);
      expect(unset(obj, [])).toBe(false);
    });
  });

  describe('setImmutable', () => {
    it('should not mutate original object', () => {
      const obj = { a: { b: 'original' } };
      const result = setImmutable(obj, 'a.b', 'new');
      
      expect(obj.a.b).toBe('original');
      expect(result.a.b).toBe('new');
      expect(result).not.toBe(obj);
    });

    it('should create deep copy with changes', () => {
      const obj = { a: { b: { c: 'value' } }, d: 'unchanged' };
      const result = setImmutable(obj, 'a.b.c', 'new');
      
      expect(result).toEqual({ a: { b: { c: 'new' } }, d: 'unchanged' });
      expect(obj.a.b.c).toBe('value');
    });
  });

  describe('update', () => {
    it('should update value using function', () => {
      const obj = { count: 5 };
      update(obj, 'count', (value) => value + 1);
      expect(obj.count).toBe(6);
    });

    it('should handle nested updates', () => {
      const obj = { user: { name: 'john', age: 30 } };
      update(obj, 'user.name', (name) => name.toUpperCase());
      expect(obj.user.name).toBe('JOHN');
    });

    it('should handle non-existent paths', () => {
      const obj = {};
      update(obj, 'new.path', (value) => value || 'default');
      expect(obj).toEqual({ new: { path: 'default' } });
    });

    it('should return the same object', () => {
      const obj = { value: 1 };
      const result = update(obj, 'value', x => x + 1);
      expect(result).toBe(obj);
    });
  });

  describe('updateImmutable', () => {
    it('should not mutate original object', () => {
      const obj = { count: 5 };
      const result = updateImmutable(obj, 'count', (value) => value + 1);
      
      expect(obj.count).toBe(5);
      expect(result.count).toBe(6);
      expect(result).not.toBe(obj);
    });

    it('should handle nested immutable updates', () => {
      const obj = { user: { name: 'john' } };
      const result = updateImmutable(obj, 'user.name', (name) => name.toUpperCase());
      
      expect(obj.user.name).toBe('john');
      expect(result.user.name).toBe('JOHN');
    });
  });

  describe('at', () => {
    const obj = {
      a: { b: 'value1' },
      c: { d: 'value2' },
      arr: [1, 2, 3]
    };

    it('should get multiple values at different paths', () => {
      const result = at(obj, ['a.b', 'c.d', 'arr[1]']);
      expect(result).toEqual(['value1', 'value2', 2]);
    });

    it('should handle non-existent paths', () => {
      const result = at(obj, ['a.b', 'nonexistent', 'c.d']);
      expect(result).toEqual(['value1', undefined, 'value2']);
    });

    it('should handle empty paths array', () => {
      expect(at(obj, [])).toEqual([]);
    });
  });

  describe('setMultiple', () => {
    it('should set multiple values at different paths', () => {
      const obj = {};
      setMultiple(obj, {
        'a.b': 'value1',
        'c.d': 'value2',
        'arr[0]': 'first'
      });
      
      expect(obj).toEqual({
        a: { b: 'value1' },
        c: { d: 'value2' },
        arr: ['first']
      });
    });

    it('should overwrite existing values', () => {
      const obj = { a: { b: 'old' }, c: 'keep' };
      setMultiple(obj, {
        'a.b': 'new',
        'd': 'added'
      });
      
      expect(obj).toEqual({
        a: { b: 'new' },
        c: 'keep',
        d: 'added'
      });
    });

    it('should return the same object', () => {
      const obj = {};
      const result = setMultiple(obj, { 'a': 'value' });
      expect(result).toBe(obj);
    });
  });

  describe('transformAt', () => {
    const obj = {
      user: {
        name: 'john',
        email: 'john@example.com'
      },
      settings: {
        theme: 'dark',
        notifications: true
      },
      data: [
        { value: 1 },
        { value: 2 }
      ]
    };

    it('should transform values matching string pattern', () => {
      const result = transformAt(obj, 'user.*', (value) => 
        typeof value === 'string' ? value.toUpperCase() : value
      );
      
      expect(result.user.name).toBe('JOHN');
      expect(result.user.email).toBe('JOHN@EXAMPLE.COM');
      expect(result.settings.theme).toBe('dark'); // unchanged
    });

    it('should transform values matching regex pattern', () => {
      const result = transformAt(obj, /\.value$/, (value) => value * 10);
      
      expect(result.data[0].value).toBe(10);
      expect(result.data[1].value).toBe(20);
      expect(result.user.name).toBe('john'); // unchanged
    });

    it('should handle wildcard patterns', () => {
      const result = transformAt(obj, 'settings.*', (value) => 
        typeof value === 'string' ? `${value}_modified` : value
      );
      
      expect(result.settings.theme).toBe('dark_modified');
      expect(result.settings.notifications).toBe(true); // unchanged (not string)
    });

    it('should not mutate original object', () => {
      const result = transformAt(obj, 'user.name', (value) => value.toUpperCase());
      
      expect(obj.user.name).toBe('john');
      expect(result.user.name).toBe('JOHN');
      expect(result).not.toBe(obj);
    });

    it('should handle array transformations', () => {
      const arrayObj = { items: [{ id: 1 }, { id: 2 }] };
      const result = transformAt(arrayObj, /items\[\d+\]\.id/, (value) => value * 100);
      
      expect(result.items[0].id).toBe(100);
      expect(result.items[1].id).toBe(200);
    });
  });
});
