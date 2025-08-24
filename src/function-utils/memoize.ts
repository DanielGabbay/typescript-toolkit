/**
 * Advanced memoization with configurable cache strategies
 */

type CacheStrategy = 'lru' | 'ttl' | 'weak';

interface MemoizeOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
  strategy?: CacheStrategy;
  keyResolver?: (...args: unknown[]) => string;
}

/**
 * Simple memoization with LRU cache
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: MemoizeOptions = {}
): (...args: TArgs) => TReturn {
  const {
    maxSize = 100,
    ttl,
    strategy = 'lru',
    keyResolver = (...args) => JSON.stringify(args)
  } = options;

  if (strategy === 'weak') {
    return memoizeWeak(fn, keyResolver);
  }

  const cache = new Map<string, { value: TReturn; timestamp?: number }>();
  const keyOrder: string[] = [];

  return (...args: TArgs): TReturn => {
    const key = keyResolver(...args);
    const cached = cache.get(key);

    // Check TTL if configured
    if (cached && ttl && cached.timestamp && Date.now() - cached.timestamp > ttl) {
      cache.delete(key);
      const keyIndex = keyOrder.indexOf(key);
      if (keyIndex > -1) keyOrder.splice(keyIndex, 1);
    } else if (cached) {
      // Move to end for LRU
      const keyIndex = keyOrder.indexOf(key);
      if (keyIndex > -1) {
        keyOrder.splice(keyIndex, 1);
        keyOrder.push(key);
      }
      return cached.value;
    }

    const result = fn(...args);
    
    // Evict oldest if at max size
    if (cache.size >= maxSize && !cache.has(key)) {
      const oldestKey = keyOrder.shift();
      if (oldestKey) cache.delete(oldestKey);
    }

    cache.set(key, { 
      value: result, 
      timestamp: ttl ? Date.now() : undefined 
    });
    
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
    }

    return result;
  };
}

/**
 * WeakMap-based memoization for object arguments
 */
function memoizeWeak<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyResolver: (...args: unknown[]) => string
): (...args: TArgs) => TReturn {
  const cache = new WeakMap();
  
  return (...args: TArgs): TReturn => {
    const firstArg = args[0];
    
    if (firstArg && typeof firstArg === 'object') {
      if (cache.has(firstArg)) {
        const subCache = cache.get(firstArg);
        const key = keyResolver(...args.slice(1));
        if (subCache.has(key)) {
          return subCache.get(key);
        }
      } else {
        cache.set(firstArg, new Map());
      }
      
      const result = fn(...args);
      const subCache = cache.get(firstArg);
      const key = keyResolver(...args.slice(1));
      subCache.set(key, result);
      return result;
    }
    
    // Fallback to regular memoization
    return memoize(fn, { keyResolver })(...args);
  };
}

/**
 * Clear memoization cache (if accessible)
 */
export function createClearableMemoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  options: MemoizeOptions = {}
): {
  memoized: (...args: TArgs) => TReturn;
  clear: () => void;
  size: () => number;
} {
  const cache = new Map<string, { value: TReturn; timestamp?: number }>();
  const keyOrder: string[] = [];
  const {
    maxSize = 100,
    ttl,
    keyResolver = (...args) => JSON.stringify(args)
  } = options;

  const memoized = (...args: TArgs): TReturn => {
    const key = keyResolver(...args);
    const cached = cache.get(key);

    // Check TTL if configured
    if (cached && ttl && cached.timestamp && Date.now() - cached.timestamp > ttl) {
      cache.delete(key);
      const keyIndex = keyOrder.indexOf(key);
      if (keyIndex > -1) keyOrder.splice(keyIndex, 1);
    } else if (cached) {
      // Move to end for LRU
      const keyIndex = keyOrder.indexOf(key);
      if (keyIndex > -1) {
        keyOrder.splice(keyIndex, 1);
        keyOrder.push(key);
      }
      return cached.value;
    }

    const result = fn(...args);
    
    // Evict oldest if at max size
    if (cache.size >= maxSize && !cache.has(key)) {
      const oldestKey = keyOrder.shift();
      if (oldestKey) cache.delete(oldestKey);
    }

    cache.set(key, { 
      value: result, 
      timestamp: ttl ? Date.now() : undefined 
    });
    
    if (!keyOrder.includes(key)) {
      keyOrder.push(key);
    }

    return result;
  };
  
  return {
    memoized,
    clear: () => {
      cache.clear();
      keyOrder.length = 0;
    },
    size: () => cache.size
  };
}
