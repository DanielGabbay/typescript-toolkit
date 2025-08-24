/* eslint-disable @typescript-eslint/no-explicit-any */

import { EnumLike } from './enum-like';

describe('EnumLike', () => {
  it('should create enum-like object from rest parameters', () => {
    // This uses the first overload
    const result = EnumLike(['a', 'b', 'c']);

    expect(result).toEqual({
      a: 'a',
      b: 'b',
      c: 'c',
    });
  });

  it('should create enum-like object from array parameter', () => {
    const colors = ['red', 'green', 'blue'] as const;
    const result = EnumLike(colors);

    expect(result).toEqual({
      red: 'red',
      green: 'green',
      blue: 'blue',
    });
  });

  it('should create enum-like object from object parameter', () => {
    const input = { x: 1, y: 2, z: 3 };
    const result = EnumLike(input);

    expect(result).toEqual({
      x: 'x',
      y: 'y',
      z: 'z',
    });
  });

  it('should handle empty inputs', () => {
    const emptyArray = EnumLike([]);
    expect(emptyArray).toEqual({});

    const emptyObject = EnumLike({});
    expect(emptyObject).toEqual({});

    const noParams = EnumLike();
    expect(noParams).toEqual({});
  });
});
