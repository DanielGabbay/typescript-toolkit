/**
 * Type utility functions and types
 */

// Type guards
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNullish(value: unknown): value is null | undefined {
  return value == null;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Enum-like utilities
export function createEnum<T extends Record<string, string | number>>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

export type EnumLike<T = string | number> = Record<string, T>;

export function getEnumValues<T extends EnumLike>(enumObj: T): Array<T[keyof T]> {
  return Object.values(enumObj) as Array<T[keyof T]>;
}

export function getEnumKeys<T extends EnumLike>(enumObj: T): Array<keyof T> {
  return Object.keys(enumObj);
}

export function isEnumValue<T extends EnumLike>(
  enumObj: T,
  value: unknown
): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

// Type assertion utilities
export function assertType<T>(value: unknown, guard: (value: unknown) => value is T): T {
  if (!guard(value)) {
    throw new Error('Type assertion failed');
  }
  return value;
}

export function assertString(value: unknown): string {
  return assertType(value, isString);
}

export function assertNumber(value: unknown): number {
  return assertType(value, isNumber);
}

export function assertObject(value: unknown): object {
  return assertType(value, isObject);
}