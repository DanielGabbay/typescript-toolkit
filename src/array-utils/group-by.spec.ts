/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  groupBy,
  groupByMap,
  groupByMultiple,
  groupConsecutiveBy,
  indexBy,
  indexByMap,
  createLookup,
  groupAndTransform,
  aggregateBy
} from './group-by';

describe('groupBy', () => {
  it('should group array elements by key function', () => {
    const users = [
      { id: 1, role: 'admin', age: 25 },
      { id: 2, role: 'user', age: 30 },
      { id: 3, role: 'admin', age: 35 }
    ];
    
    const result = groupBy(users, user => user.role);
    expect(result).toEqual({
      admin: [{ id: 1, role: 'admin', age: 25 }, { id: 3, role: 'admin', age: 35 }],
      user: [{ id: 2, role: 'user', age: 30 }]
    });
  });

  it('should handle numeric keys', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = groupBy(numbers, n => n % 2);
    expect(result).toEqual({
      0: [2, 4, 6],
      1: [1, 3, 5]
    });
  });

  it('should handle empty array', () => {
    expect(groupBy([], x => x)).toEqual({});
  });
});

describe('groupByMap', () => {
  it('should group array elements using Map', () => {
    const users = [
      { id: 1, role: 'admin' },
      { id: 2, role: 'user' },
      { id: 3, role: 'admin' }
    ];
    
    const result = groupByMap(users, user => user.role);
    expect(result.get('admin')).toEqual([{ id: 1, role: 'admin' }, { id: 3, role: 'admin' }]);
    expect(result.get('user')).toEqual([{ id: 2, role: 'user' }]);
    expect(result.size).toBe(2);
  });

  it('should handle complex keys', () => {
    const items = [
      { obj: { x: 1 }, value: 'a' },
      { obj: { x: 2 }, value: 'b' },
      { obj: { x: 1 }, value: 'c' }
    ];
    
    const result = groupByMap(items, item => item.obj);
    expect(result.size).toBe(3); // Each object is unique by reference
  });
});

describe('groupByMultiple', () => {
  it('should group by multiple key functions', () => {
    const users = [
      { name: 'John', role: 'admin', department: 'IT' },
      { name: 'Jane', role: 'user', department: 'IT' },
      { name: 'Bob', role: 'admin', department: 'HR' },
      { name: 'Alice', role: 'admin', department: 'IT' }
    ];
    
    const result = groupByMultiple(users, u => u.role, u => u.department);
    expect(result.get('admin|IT')).toEqual([
      { name: 'John', role: 'admin', department: 'IT' },
      { name: 'Alice', role: 'admin', department: 'IT' }
    ]);
    expect(result.get('user|IT')).toEqual([{ name: 'Jane', role: 'user', department: 'IT' }]);
    expect(result.get('admin|HR')).toEqual([{ name: 'Bob', role: 'admin', department: 'HR' }]);
  });

  it('should handle single key function', () => {
    const numbers = [1, 2, 1, 3];
    const result = groupByMultiple(numbers, x => x);
    expect(result.get('1')).toEqual([1, 1]);
    expect(result.get('2')).toEqual([2]);
    expect(result.get('3')).toEqual([3]);
  });
});

describe('groupConsecutiveBy', () => {
  it('should group consecutive elements by key', () => {
    const data = [
      { type: 'A', value: 1 },
      { type: 'A', value: 2 },
      { type: 'B', value: 3 },
      { type: 'A', value: 4 },
      { type: 'A', value: 5 }
    ];
    
    const result = groupConsecutiveBy(data, item => item.type);
    expect(result).toEqual([
      { key: 'A', items: [{ type: 'A', value: 1 }, { type: 'A', value: 2 }] },
      { key: 'B', items: [{ type: 'B', value: 3 }] },
      { key: 'A', items: [{ type: 'A', value: 4 }, { type: 'A', value: 5 }] }
    ]);
  });

  it('should handle empty array', () => {
    expect(groupConsecutiveBy([], x => x)).toEqual([]);
  });

  it('should handle single element', () => {
    const result = groupConsecutiveBy(['a'], x => x);
    expect(result).toEqual([{ key: 'a', items: ['a'] }]);
  });
});

describe('indexBy', () => {
  it('should create index by key function', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' }
    ];
    
    const result = indexBy(users, user => user.id);
    expect(result).toEqual({
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' },
      3: { id: 3, name: 'Bob' }
    });
  });

  it('should overwrite duplicate keys', () => {
    const items = [
      { id: 1, value: 'first' },
      { id: 1, value: 'second' }
    ];
    
    const result = indexBy(items, item => item.id);
    expect(result[1]).toEqual({ id: 1, value: 'second' });
  });
});

describe('indexByMap', () => {
  it('should create Map index by key function', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    
    const result = indexByMap(users, user => user.id);
    expect(result.get(1)).toEqual({ id: 1, name: 'John' });
    expect(result.get(2)).toEqual({ id: 2, name: 'Jane' });
    expect(result.size).toBe(2);
  });

  it('should handle complex keys', () => {
    const items = [
      { key: { x: 1 }, value: 'a' },
      { key: { x: 2 }, value: 'b' }
    ];
    
    const result = indexByMap(items, item => item.key);
    expect(result.size).toBe(2);
  });
});

describe('createLookup', () => {
  it('should create lookup table with value transformation', () => {
    const orders = [
      { customerId: 1, amount: 100 },
      { customerId: 2, amount: 200 },
      { customerId: 1, amount: 150 }
    ];
    
    const result = createLookup(orders, o => o.customerId, o => o.amount);
    expect(result).toEqual({
      1: [100, 150],
      2: [200]
    });
  });

  it('should handle string transformation', () => {
    const users = [
      { department: 'IT', name: 'John' },
      { department: 'HR', name: 'Jane' },
      { department: 'IT', name: 'Bob' }
    ];
    
    const result = createLookup(users, u => u.department, u => u.name);
    expect(result).toEqual({
      IT: ['John', 'Bob'],
      HR: ['Jane']
    });
  });
});

describe('groupAndTransform', () => {
  it('should group and transform in one step', () => {
    const orders = [
      { customerId: 1, amount: 100 },
      { customerId: 2, amount: 200 },
      { customerId: 1, amount: 150 }
    ];
    
    const result = groupAndTransform(
      orders,
      o => o.customerId,
      orders => orders.reduce((sum, o) => sum + o.amount, 0)
    );
    
    expect(result).toEqual({
      1: 250,
      2: 200
    });
  });

  it('should handle array transformation', () => {
    const users = [
      { department: 'IT', name: 'John' },
      { department: 'HR', name: 'Jane' },
      { department: 'IT', name: 'Bob' }
    ];
    
    const result = groupAndTransform(
      users,
      u => u.department,
      users => users.map(u => u.name).sort()
    );
    
    expect(result).toEqual({
      IT: ['Bob', 'John'],
      HR: ['Jane']
    });
  });
});

describe('aggregateBy', () => {
  it('should aggregate values by key', () => {
    const sales = [
      { product: 'A', amount: 100 },
      { product: 'B', amount: 200 },
      { product: 'A', amount: 150 },
      { product: 'B', amount: 300 }
    ];
    
    const result = aggregateBy(
      sales,
      s => s.product,
      s => s.amount,
      amounts => amounts.reduce((sum, a) => sum + a, 0)
    );
    
    expect(result).toEqual({
      A: 250,
      B: 500
    });
  });

  it('should handle average aggregation', () => {
    const grades = [
      { student: 'John', score: 85 },
      { student: 'Jane', score: 92 },
      { student: 'John', score: 78 },
      { student: 'Jane', score: 88 }
    ];
    
    const result = aggregateBy(
      grades,
      g => g.student,
      g => g.score,
      scores => scores.reduce((sum, s) => sum + s, 0) / scores.length
    );
    
    expect(result).toEqual({
      John: 81.5,
      Jane: 90
    });
  });
});