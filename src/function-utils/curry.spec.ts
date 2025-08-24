/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { curry, curryN, curryRight, partial, partialWith, _, flip, unary, binary, nAry } from './curry';

describe('curry', () => {
  it('should curry a simple function', () => {
    const add = (a: number, b: number) => a + b;
    const curriedAdd = curry(add);
    
    expect(curriedAdd(5)(3)).toBe(8);
  });

  it('should curry a three-argument function', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const curriedAdd3 = curry(add3);
    
    expect(curriedAdd3(1)(2)(3)).toBe(6);
    expect(curriedAdd3(1, 2)(3)).toBe(6);
    expect(curriedAdd3(1)(2, 3)).toBe(6);
    expect(curriedAdd3(1, 2, 3)).toBe(6);
  });

  it('should handle partial application', () => {
    const multiply = (a: number, b: number, c: number) => a * b * c;
    const curriedMultiply = curry(multiply);
    
    const multiplyBy2 = curriedMultiply(2);
    const multiplyBy2And3 = multiplyBy2(3);
    
    expect(multiplyBy2And3(4)).toBe(24);
  });

  it('should work with non-numeric types', () => {
    const concat = (a: string, b: string, c: string) => a + b + c;
    const curriedConcat = curry(concat);
    
    expect(curriedConcat('Hello')(' ')('World')).toBe('Hello World');
  });
});

describe('curryN', () => {
  it('should curry with specified arity', () => {
    const variadic = (...args: number[]) => args.reduce((sum, n) => sum + n, 0);
    const curriedVariadic = curryN(3, variadic);
    
    expect(curriedVariadic(1)(2)(3)).toBe(6);
  });

  it('should stop currying at specified arity', () => {
    const variadic = (...args: number[]) => args.length;
    const curry2 = curryN(2, variadic);
    
    expect(curry2(1)(2)).toBe(2);
  });

  it('should handle arity larger than function length', () => {
    const add = (a: number, b: number) => a + b;
    const curry5 = curryN(5, add);
    
    // Should execute when we reach arity 5, even though function only needs 2 args
    expect(curry5(1)(2)(3)(4)(5)).toBe(3); // Only uses first 2 args
  });
});

describe('curryRight', () => {
  it('should curry from right to left', () => {
    const subtract = (a: number, b: number) => a - b;
    const curriedSubtract = curryRight(subtract);
    
    // When called as curriedSubtract(3)(5), it becomes subtract(5, 3) = 2
    expect(curriedSubtract(3)(5)).toBe(2);
  });

  it('should work with three arguments', () => {
    const divide = (a: number, b: number, c: number) => a / b / c;
    const curriedDivide = curryRight(divide);
    
    // curriedDivide(2)(4)(8) becomes divide(8, 4, 2) = 1
    expect(curriedDivide(2)(4)(8)).toBe(1);
  });
});

describe('partial', () => {
  it('should apply partial arguments', () => {
    const add3 = (a: number, b: number, c: number) => a + b + c;
    const partialAdd = partial(add3, 10, 20);
    
    expect(partialAdd(30)).toBe(60);
  });

  it('should work with string arguments', () => {
    const concat = (a: string, b: string, c: string) => a + b + c;
    const partialConcat = partial(concat, 'Hello', ' ');
    
    expect(partialConcat('World')).toBe('Hello World');
  });

  it('should handle no partial arguments', () => {
    const multiply = (a: number, b: number) => a * b;
    const noPartial = partial(multiply);
    
    expect(noPartial(3, 4)).toBe(12);
  });
});

describe('partialWith', () => {
  it('should use placeholders', () => {
    const subtract = (a: number, b: number, c: number) => a - b - c;
    const partialSubtract = partialWith(subtract, _, 10, _);
    
    expect(partialSubtract(20, 5)).toBe(5); // 20 - 10 - 5 = 5
  });

  it('should fill placeholders in order', () => {
    const format = (template: string, name: string, age: number) => 
      template.replace('%s', name).replace('%d', age.toString());
    
    const partialFormat = partialWith(format, 'Hello %s, you are %d', _, _);
    expect(partialFormat('John', 25)).toBe('Hello John, you are 25');
  });

  it('should handle extra arguments after all placeholders filled', () => {
    const add = (a: number, b: number) => a + b;
    const partialAdd = partialWith(add, _);
    
    expect(partialAdd(5, 10)).toBe(15); // Second argument (10) is ignored
  });

  it('should handle no placeholders', () => {
    const multiply = (a: number, b: number) => a * b;
    const partialMultiply = partialWith(multiply, 3, 4);
    
    expect(partialMultiply()).toBe(12);
  });
});

describe('flip', () => {
  it('should flip two arguments', () => {
    const divide = (a: number, b: number) => a / b;
    const flippedDivide = flip(divide);
    
    expect(flippedDivide(2, 8)).toBe(4); // 8 / 2 = 4
  });

  it('should flip three arguments', () => {
    const subtract = (a: number, b: number, c: number) => a - b - c;
    const flippedSubtract = flip(subtract);
    
    expect(flippedSubtract(1, 2, 10)).toBe(7); // 10 - 2 - 1 = 7
  });

  it('should work with string concatenation', () => {
    const concat = (a: string, b: string) => a + b;
    const flippedConcat = flip(concat);
    
    expect(flippedConcat('World', 'Hello')).toBe('HelloWorld');
  });
});

describe('unary', () => {
  it('should convert function to take only one argument', () => {
    const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
    const unarySum = unary(sum);
    
    expect(unarySum(5)).toBe(5);
  });

  it('should work with Array.map', () => {
    const numbers = ['1', '2', '3'];
    const parseIntUnary = unary(parseInt);
    
    const result = numbers.map(parseIntUnary);
    expect(result).toEqual([1, 2, 3]);
  });
});

describe('binary', () => {
  it('should convert function to take only two arguments', () => {
    const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
    const binarySum = binary(sum);
    
    expect(binarySum(5, 3)).toBe(8);
  });

  it('should ignore extra arguments', () => {
    const add = (a: number, b: number) => a + b;
    const binaryAdd = binary(add);
    
    // TypeScript might complain, but at runtime extra args are ignored
    expect((binaryAdd as any)(1, 2, 3, 4, 5)).toBe(3);
  });
});

describe('nAry', () => {
  it('should limit function to N arguments', () => {
    const sum = (...args: number[]) => args.reduce((a, b) => a + b, 0);
    const ternarySum = nAry(3, sum);
    
    expect((ternarySum as any)(1, 2, 3, 4, 5)).toBe(6); // Only first 3 args: 1+2+3
  });

  it('should handle N=0', () => {
    const getConstant = () => 42;
    const nullaryConstant = nAry(0, getConstant);
    
    expect((nullaryConstant as any)(1, 2, 3)).toBe(42);
  });

  it('should handle N larger than actual arguments', () => {
    const add = (a: number, b: number) => a + b;
    const tenAryAdd = nAry(10, add);
    
    expect((tenAryAdd as any)(5, 3)).toBe(8);
  });
});