# TypeScript Toolkit

[![npm version](https://badge.fury.io/js/typescript-toolkit.svg)](https://badge.fury.io/js/typescript-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/typescript-toolkit.svg)](https://npmjs.com/package/typescript-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Build Status](https://github.com/danielgabbay/typescript-toolkit/workflows/CI%2FCD/badge.svg)](https://github.com/danielgabbay/typescript-toolkit/actions)
[![Coverage](https://img.shields.io/badge/coverage-97.77%25-brightgreen)](https://github.com/danielgabbay/typescript-toolkit)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/typescript-toolkit)](https://bundlephobia.com/package/typescript-toolkit)
[![Tree Shakable](https://img.shields.io/badge/tree--shakable-yes-brightgreen)](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

> 🚀 **Modern utility functions for TypeScript development**

A comprehensive, type-safe, and tree-shakable collection of utility functions designed specifically for TypeScript projects. Zero dependencies, full TypeScript support, and optimized for modern development workflows.

## ⚡ Quick Start

```bash
npm install typescript-toolkit
```

```typescript
// Import everything
import * as toolkit from 'typescript-toolkit';

// Tree-shakable imports (recommended)
import { chunk, unique } from 'typescript-toolkit/array';
import { camelCase, slugify } from 'typescript-toolkit/string';
import { deepClone, pick } from 'typescript-toolkit/object';

// Usage examples
const users = [
  { name: 'john doe', age: 30, role: 'admin' },
  { name: 'jane smith', age: 25, role: 'user' },
  { name: 'bob johnson', age: 35, role: 'user' }
];

// Transform and process data
const chunks = chunk(users, 2);
const adminUsers = users.filter(u => u.role === 'admin');
const userNames = users.map(u => camelCase(u.name));
const settings = deepClone(config);

console.log(chunks); // [[{...}, {...}], [{...}]]
console.log(userNames); // ['johnDoe', 'janeSmith', 'bobJohnson']
```

## 🌟 Features

- ✅ **Tree-shakable** - Import only what you need, reduce bundle size
- ✅ **TypeScript First** - Full type safety and IntelliSense support
- ✅ **Zero Dependencies** - Lightweight and secure
- ✅ **Modern ES Modules** - Works with all modern bundlers
- ✅ **97%+ Test Coverage** - Thoroughly tested and reliable
- ✅ **Performance Optimized** - Efficient implementations
- ✅ **Modular Design** - Clean API with logical groupings

## 📚 API Documentation

<details>
<summary><strong>🔢 Array Utilities</strong> - 21+ functions for array manipulation</summary>

### Import
```typescript
import { chunk, unique, groupBy, sum, mean } from 'typescript-toolkit/array';
```

### Chunking & Splitting
```typescript
chunk([1, 2, 3, 4, 5], 2);              // [[1, 2], [3, 4], [5]]
partition([1, 2, 3, 4], x => x % 2);     // [[2, 4], [1, 3]]
```

### Uniqueness & Deduplication
```typescript
unique([1, 2, 2, 3, 3, 3]);             // [1, 2, 3]
uniqueBy([{id: 1}, {id: 2}, {id: 1}], x => x.id); // [{id: 1}, {id: 2}]
```

### Grouping & Indexing
```typescript
const people = [
  { name: 'John', dept: 'IT' },
  { name: 'Jane', dept: 'HR' },
  { name: 'Bob', dept: 'IT' }
];
groupBy(people, p => p.dept);
// { IT: [{name: 'John', dept: 'IT'}, {name: 'Bob', dept: 'IT'}], HR: [...] }
```

### Set Operations
```typescript
union([1, 2], [2, 3], [3, 4]);          // [1, 2, 3, 4]
intersection([1, 2, 3], [2, 3, 4]);     // [2, 3]
difference([1, 2, 3], [2], [4]);        // [1, 3]
```

### Statistics
```typescript
sum([1, 2, 3, 4, 5]);                   // 15
mean([2, 4, 6]);                        // 4
median([1, 3, 5]);                      // 3
```

### Search & Sort
```typescript
binarySearch([1, 3, 5, 7, 9], 5);       // 2
sortBy(people, p => p.age, p => p.name); // Multi-key sorting
```

</details>

<details>
<summary><strong>🎯 Function Utilities</strong> - 8+ functions for functional programming</summary>

### Import
```typescript
import { compose, pipe, curry, debounce, memoize } from 'typescript-toolkit/function';
```

### Function Composition
```typescript
const add = (x: number) => x + 1;
const multiply = (x: number) => x * 2;

compose(add, multiply)(5);               // 11 (5 * 2 + 1)
pipe(add, multiply)(5);                  // 12 ((5 + 1) * 2)
```

### Currying
```typescript
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
curriedAdd(1)(2);                        // 3
curriedAdd(1, 2);                        // 3
```

### Performance Control
```typescript
const search = debounce(searchAPI, 300); // Debounce API calls
const expensiveFn = memoize(calculateResult); // Cache results
```

### Error Handling
```typescript
await retry(unstableAPI, 3, 1000);       // Retry 3 times with 1s delay
const result = tryCatch(() => riskyOperation(), 'default');
```

</details>

<details>
<summary><strong>📦 Object Utilities</strong> - 9+ functions for object manipulation</summary>

### Import
```typescript
import { deepClone, pick, omit, get, set } from 'typescript-toolkit/object';
```

### Deep Operations
```typescript
const original = { user: { profile: { name: 'John' } } };
const cloned = deepClone(original);      // Deep clone
deepMerge(target, source1, source2);     // Deep merge
```

### Property Selection
```typescript
const user = { id: 1, name: 'John', email: 'john@email.com', password: 'secret' };
pick(user, 'id', 'name');               // { id: 1, name: 'John' }
omit(user, 'password');                  // { id: 1, name: 'John', email: '...' }
```

### Path-based Access
```typescript
const data = { user: { profile: { settings: { theme: 'dark' } } } };
get(data, 'user.profile.settings.theme', 'light'); // 'dark'
set(data, 'user.profile.settings.theme', 'light');
```

### Transformation
```typescript
mapKeys(obj, key => key.toUpperCase());   // Transform all keys
mapValues(obj, val => val * 2);          // Transform all values
invert({ a: '1', b: '2' });              // { '1': 'a', '2': 'b' }
```

</details>

<details>
<summary><strong>🔤 String Utilities</strong> - 20+ functions for string processing</summary>

### Import
```typescript
import { camelCase, kebabCase, slugify, isEmail } from 'typescript-toolkit/string';
```

### Case Conversion
```typescript
camelCase('hello world');                // 'helloWorld'
pascalCase('hello world');               // 'HelloWorld'
kebabCase('helloWorld');                 // 'hello-world'
snakeCase('helloWorld');                 // 'hello_world'
```

### Formatting
```typescript
capitalize('hello');                     // 'Hello'
titleCase('hello world');                // 'Hello World'
truncate('Long text here', 10);          // 'Long te...'
pad('hi', 6, '*');                       // '**hi**'
```

### Validation
```typescript
isEmail('test@example.com');             // true
isUrl('https://example.com');            // true
isNumeric('123.45');                     // true
isAlpha('Hello');                        // true
```

### Advanced Manipulation
```typescript
slugify('Hello World! 123');            // 'hello-world-123'
removeAccents('café naïve');             // 'cafe naive'
escapeHtml('<script>');                  // '&lt;script&gt;'
```

</details>

<details>
<summary><strong>🏷️ Type Utilities</strong> - 18+ utilities for type checking and assertion</summary>

### Import
```typescript
import { isString, isNumber, assertType } from 'typescript-toolkit/type';
```

### Type Guards
```typescript
if (isString(value)) {
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}

isNumber(42);                           // true
isArray([1, 2, 3]);                     // true
isDefined(value);                       // true (not null/undefined)
```

### Utility Types
```typescript
type User = { name: string; age: number; settings: { theme: string } };
type PartialUser = DeepPartial<User>;    // All properties optional recursively
type ReadonlyUser = DeepReadonly<User>;  // All properties readonly recursively
```

### Enum Utilities
```typescript
const Colors = createEnum({ RED: 'red', BLUE: 'blue' });
getEnumValues(Colors);                   // ['red', 'blue']
isEnumValue(Colors, 'red');              // true
```

### Type Assertions
```typescript
const str = assertString(unknownValue); // Throws if not string
const num = assertNumber(userInput);    // Type-safe assertion
```

</details>

<details>
<summary><strong>⚡ Performance Utilities</strong> - 5+ tools for performance monitoring</summary>

### Import
```typescript
import { time, benchmark, PerformanceTimer } from 'typescript-toolkit/performance';
```

### Timing Functions
```typescript
const { result, duration } = time(() => expensiveOperation());
const asyncResult = await timeAsync(async () => await fetchData());
```

### Benchmarking
```typescript
const stats = benchmark(() => sortArray(data), 1000);
console.log(`Average: ${stats.average}ms, Min: ${stats.min}ms`);

const asyncStats = await benchmarkAsync(async () => await apiCall(), 100);
```

### Manual Timing
```typescript
const timer = new PerformanceTimer();
timer.start();
// ... some operations
const elapsed = timer.duration; // Get current duration
timer.stop();
console.log(`Total time: ${timer.duration}ms`);
```

</details>

## 📈 Bundle Size Impact

TypeScript Toolkit is optimized for minimal bundle impact:

| Import Style | Bundle Size | Description |
|--------------|-------------|-------------|
| `import { chunk } from 'typescript-toolkit/array'` | ~0.3KB | Single function |
| `import { camelCase, slugify } from 'typescript-toolkit/string'` | ~0.8KB | Multiple functions |
| `import * from 'typescript-toolkit'` | ~25KB | Full library (not recommended) |

## 🚀 Advanced Usage Examples

### Data Processing Pipeline
```typescript
import { chunk, groupBy, sum } from 'typescript-toolkit/array';
import { pick, mapValues } from 'typescript-toolkit/object';
import { camelCase } from 'typescript-toolkit/string';

// Process user analytics data
const analytics = rawData
  .map(user => pick(user, 'id', 'name', 'purchases', 'signupDate'))
  .map(user => ({ ...user, name: camelCase(user.name) }))
  |> groupBy(%, user => user.signupDate.getMonth())
  |> mapValues(%, users => ({
      count: users.length,
      totalPurchases: sum(users.map(u => u.purchases))
    }));
```

### API Response Transformation
```typescript
import { deepClone, omit } from 'typescript-toolkit/object';
import { slugify, camelCase } from 'typescript-toolkit/string';

function transformApiResponse(response: ApiResponse) {
  const cleaned = omit(response, 'internal', 'debug');
  const normalized = deepClone(cleaned);
  
  // Transform all string fields to camelCase
  return mapValues(normalized, (value, key) => 
    typeof value === 'string' ? camelCase(value) : value
  );
}
```

### Form Validation Helper
```typescript
import { isEmail, isNumeric } from 'typescript-toolkit/string';
import { isDefined } from 'typescript-toolkit/type';

const validators = {
  required: (value: unknown) => isDefined(value) && value !== '',
  email: (value: string) => isEmail(value),
  numeric: (value: string) => isNumeric(value),
  minLength: (min: number) => (value: string) => value.length >= min
};
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run dev

# Run all tests
npm run test

# Check test coverage
npm run test:coverage

# Lint code
npm run lint

# Type check
npm run typecheck

# Build for production
npm run build
```

## 📊 Project Stats

- **117 test cases** with 97.77% coverage
- **87 utility functions** across 6 modules
- **Zero dependencies** - completely self-contained
- **TypeScript 5.5+** - Latest features supported
- **ES2022 target** - Modern JavaScript features
- **Automated releases** - Semantic versioning with every push
- **Conventional commits** - Structured commit messages for automatic changelog

## 🤝 Contributing

Contributions are welcome! This project uses **conventional commits** and **semantic versioning**.

### Quick Contributing Guide:

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Create feature branch**: `git checkout -b feat/your-feature`
4. **Make changes** and add tests
5. **Use conventional commits**:
   ```bash
   git commit -m "feat(array): add new shuffle function"
   git commit -m "fix(string): handle edge case in camelCase"
   git commit -m "docs: update README examples"
   ```
6. **Push and create PR**

### Commit Types:
- `feat:` → New feature (minor version bump)
- `fix:` → Bug fix (patch version bump)  
- `feat!:` → Breaking change (major version bump)
- `docs:` → Documentation changes
- `test:` → Test updates
- `refactor:` → Code refactoring

### Automatic Releases:
Pushing to `main` with conventional commits triggers automatic:
- Version bumping
- NPM publishing  
- Changelog generation
- GitHub releases

See [PUBLISHING.md](./PUBLISHING.md) for detailed release process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## ☕ Support the Project

If TypeScript Toolkit has been helpful to you, consider supporting its development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support%20development-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://buymeacoffee.com/danielgabbay)

Your support helps maintain and improve this project!

## 📞 Connect

- 🐦 Twitter: [@danielgabbay](https://twitter.com/danielgabbay3)
- 💼 LinkedIn: [Daniel Gabbay](https://www.linkedin.com/in/danielil/)
---

<div align="center">

**[⬆ back to top](#typescript-toolkit)**

Made with ❤️ by [Daniel Gabbay](https://github.com/danielgabbay)

</div>