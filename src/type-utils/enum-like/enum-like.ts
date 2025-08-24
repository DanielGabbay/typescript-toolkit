/**
 * Utility functions for creating enum-like objects
 *
 * @example
 * ```ts
 * const Colors = EnumLike('Red', 'Green', 'Blue'); // { Red: 'Red', Green: 'Green', Blue: 'Blue' }
 * ```
 *
 * @example with TypeFrom
 * ```ts
 * export const MyEnum = EnumLike('A', 'B', 'C'); // represents { A: 'A', B: 'B', C: 'C' } for value lookup and type safety
 * export type MyEnum = TypeFrom<typeof MyEnum>; // represent the type that allows 'A' | 'B' | 'C'
 * ```
 */

export function EnumLike<T extends readonly unknown[] | Record<PropertyKey, unknown>>(
  input?: T
): {
  [K in T extends readonly (infer E)[] ? (E extends PropertyKey ? E : never) : keyof T]: K;
};
export function EnumLike<T extends object>(param?: T | (keyof T)[]): { [K in keyof T]: K } {
  if (!param || (Array.isArray(param) && param.length === 0)) {
    return {} as { [K in keyof T]: K };
  }
  if (Array.isArray(param)) {
    return Object.fromEntries(param.map((key) => [key, key])) as { [K in keyof T]: K };
  } else if (typeof param === 'object') {
    const keys = Object.keys(param) as (keyof T)[];
    return Object.fromEntries(keys.map((key) => [key, key])) as { [K in keyof T]: K };
  } else {
    // Handle other cases
    return {} as { [K in keyof T]: K };
  }
}
