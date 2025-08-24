# TypeScript Toolkit

Modern utility functions for TypeScript development.

## Installation

```bash
npm install typescript-toolkit
```

## Usage

### Import everything
```typescript
import * as toolkit from 'typescript-toolkit';
```

### Import specific modules
```typescript
import { chunk, unique, groupBy } from 'typescript-toolkit/array';
import { camelCase, kebabCase } from 'typescript-toolkit/string';
import { deepClone, pick, omit } from 'typescript-toolkit/object';
```

## API Reference

### 🔢 Array Utilities (`typescript-toolkit/array`)

#### Chunking & Splitting
- `chunk(array, size)` - Split array into chunks of specified size
- `partition(array, predicate)` - Split array into two based on predicate

#### Uniqueness & Deduplication
- `unique(array)` - Remove duplicates using Set
- `uniqueBy(array, keyFn)` - Remove duplicates by key function

#### Grouping & Indexing  
- `groupBy(array, keyFn)` - Group elements by key function

#### Flattening
- `flatten(array)` - Flatten array by one level
- `flattenDeep(array)` - Deep flatten all levels
- `flattenDepth(array, depth)` - Flatten to specified depth

#### Set Operations
- `union(...arrays)` - Union of arrays (removes duplicates)
- `intersection(...arrays)` - Intersection of arrays
- `difference(first, ...others)` - Elements in first but not in others

#### Statistics (for number arrays)
- `sum(numbers)` - Calculate sum
- `mean(numbers)` - Calculate average
- `median(numbers)` - Calculate median

#### Search & Sort
- `binarySearch(array, target, compareFn?)` - Binary search in sorted array
- `sortBy(array, ...keyFns)` - Sort by multiple key functions

#### Array Manipulation
- `zip(...arrays)` - Zip arrays together

### 🎯 Function Utilities (`typescript-toolkit/function`)

#### Composition
- `compose(...fns)` - Compose functions right-to-left
- `pipe(...fns)` - Compose functions left-to-right

#### Currying
- `curry(fn)` - Curry function for partial application

#### Performance Control
- `debounce(func, wait)` - Debounce function calls
- `throttle(func, limit)` - Throttle function calls
- `memoize(fn, getKey?)` - Cache function results

#### Error Handling & Retry
- `retry(fn, attempts?, delay?)` - Retry async operations
- `tryCatch(fn, onError?)` - Safe function execution

### 📦 Object Utilities (`typescript-toolkit/object`)

#### Deep Operations
- `deepClone(obj)` - Deep clone objects
- `deepMerge(target, ...sources)` - Deep merge objects

#### Property Selection
- `pick(obj, ...keys)` - Select specific properties
- `omit(obj, ...keys)` - Remove specific properties

#### Path Operations
- `get(obj, path, defaultValue?)` - Get value by path string
- `set(obj, path, value)` - Set value by path string

#### Transformation
- `mapKeys(obj, fn)` - Transform object keys
- `mapValues(obj, fn)` - Transform object values
- `invert(obj)` - Swap keys and values

### 🔤 String Utilities (`typescript-toolkit/string`)

#### Case Conversion
- `camelCase(str)` - Convert to camelCase
- `pascalCase(str)` - Convert to PascalCase
- `kebabCase(str)` - Convert to kebab-case
- `snakeCase(str)` - Convert to snake_case

#### Formatting
- `capitalize(str)` - Capitalize first letter
- `titleCase(str)` - Convert to Title Case
- `truncate(str, length, suffix?)` - Truncate with suffix
- `pad(str, length, char?)` - Pad string to length
- `padStart(str, length, char?)` - Pad at start
- `padEnd(str, length, char?)` - Pad at end

#### Validation
- `isEmail(str)` - Validate email format
- `isUrl(str)` - Validate URL format
- `isNumeric(str)` - Check if string is numeric
- `isAlpha(str)` - Check if string contains only letters
- `isAlphanumeric(str)` - Check if string is alphanumeric

#### Manipulation
- `reverse(str)` - Reverse string
- `slugify(str)` - Create URL-friendly slug
- `removeAccents(str)` - Remove accent marks
- `escapeHtml(str)` - Escape HTML entities
- `unescapeHtml(str)` - Unescape HTML entities

### 🏷️ Type Utilities (`typescript-toolkit/type`)

#### Type Guards
- `isString(value)` - Check if value is string
- `isNumber(value)` - Check if value is number
- `isBoolean(value)` - Check if value is boolean
- `isObject(value)` - Check if value is object
- `isArray(value)` - Check if value is array
- `isFunction(value)` - Check if value is function
- `isNull(value)` - Check if value is null
- `isUndefined(value)` - Check if value is undefined
- `isNullish(value)` - Check if value is null or undefined
- `isDefined(value)` - Check if value is not null/undefined

#### Utility Types
- `DeepPartial<T>` - Make all properties optional recursively
- `DeepRequired<T>` - Make all properties required recursively
- `DeepReadonly<T>` - Make all properties readonly recursively
- `Mutable<T>` - Remove readonly modifiers
- `ValueOf<T>` - Get union of all property values
- `KeysOfType<T, U>` - Get keys of properties matching type

#### Enum Helpers
- `createEnum(obj)` - Create frozen enum-like object
- `getEnumValues(enumObj)` - Get array of enum values
- `getEnumKeys(enumObj)` - Get array of enum keys
- `isEnumValue(enumObj, value)` - Check if value is valid enum value

#### Type Assertions
- `assertType(value, guard)` - Assert value matches type guard
- `assertString(value)` - Assert value is string
- `assertNumber(value)` - Assert value is number
- `assertObject(value)` - Assert value is object

### ⚡ Performance Utilities (`typescript-toolkit/performance`)

#### Timing
- `time(fn)` - Measure function execution time
- `timeAsync(fn)` - Measure async function execution time

#### Benchmarking
- `benchmark(fn, iterations?)` - Benchmark function performance
- `benchmarkAsync(fn, iterations?)` - Benchmark async function

#### Memory
- `measureMemory(fn)` - Measure memory usage (when available)

#### Timer Class
- `PerformanceTimer` - Timer class for manual timing
  - `.start()` - Start timer
  - `.stop()` - Stop timer
  - `.duration` - Get elapsed time
  - `.reset()` - Reset timer

## Development

```bash
npm run dev      # Run tests in watch mode
npm run test     # Run tests
npm run build    # Build the library
npm run lint     # Lint code
npm run typecheck # Check types
```

## Features

- ✅ **Tree-shakable** - Import only what you need
- ✅ **TypeScript first** - Full type safety and IntelliSense
- ✅ **Modern ES modules** - Works with bundlers and Node.js
- ✅ **Comprehensive testing** - Well tested with Vitest
- ✅ **Zero dependencies** - Lightweight and secure
- ✅ **Performance optimized** - Efficient implementations

## License

MIT