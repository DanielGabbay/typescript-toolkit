/**
 * @description Creates a type from the values of an object.
 * @example
 * const MyObject = { a: 'a', b: 'b' } as const;
 * type MyObjectValues = TypeFrom<typeof MyObject>; // 'a' | 'b'
 */
export type TypeFrom<O extends object> = O[keyof O];
