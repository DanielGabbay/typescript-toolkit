# Tree Shaking Support

This library provides **full tree shaking support** for optimal bundle sizes.

## Features

Tree shaking is fully supported through:
- ES Modules format
- Named exports  
- `sideEffects: false` in package.json
- Modular architecture

## Usage Examples

```typescript
// ✅ Tree-shakable imports - only include what you need
import { chunk, camelCase } from '@danielgabbay/typescript-toolkit';

// ❌ Imports entire library
import * as toolkit from '@danielgabbay/typescript-toolkit';
```

## Benefits

- **Smaller bundle sizes** - Only required functions are included
- **Faster loading** - Less code to download and parse
- **Better performance** - Reduced JavaScript execution time
