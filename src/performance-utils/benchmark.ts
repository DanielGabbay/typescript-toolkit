/**
 * Performance benchmarking utilities
 */

export interface BenchmarkResult {
  name: string;
  executionTime: number;
  iterations: number;
  opsPerSecond: number;
  memoryUsage?: {
    used: number;
    total: number;
    delta?: number;
  };
}

export interface BenchmarkOptions {
  iterations?: number;
  warmupIterations?: number;
  timeout?: number;
  collectMemoryStats?: boolean;
  beforeEach?: () => void;
  afterEach?: () => void;
}

/**
 * Benchmark a function's performance
 */
export async function benchmark<T extends unknown[], R>(
  name: string,
  fn: (...args: T) => R | Promise<R>,
  args: T,
  options: BenchmarkOptions = {}
): Promise<BenchmarkResult> {
  const {
    iterations = 1000,
    warmupIterations = 100,
    timeout = 5000,
    collectMemoryStats = false,
    beforeEach,
    afterEach
  } = options;

  // Warmup
  for (let i = 0; i < warmupIterations; i++) {
    beforeEach?.();
    await fn(...args);
    afterEach?.();
  }

  const startMemory = collectMemoryStats ? getMemoryUsage() : undefined;
  const startTime = performance.now();
  const timeoutTime = startTime + timeout;
  
  let actualIterations = 0;
  
  for (let i = 0; i < iterations; i++) {
    if (performance.now() > timeoutTime) {
      break;
    }
    
    beforeEach?.();
    await fn(...args);
    afterEach?.();
    actualIterations++;
  }
  
  const endTime = performance.now();
  const endMemory = collectMemoryStats ? getMemoryUsage() : undefined;
  
  const executionTime = endTime - startTime;
  const opsPerSecond = (actualIterations / executionTime) * 1000;
  
  const result: BenchmarkResult = {
    name,
    executionTime,
    iterations: actualIterations,
    opsPerSecond
  };
  
  if (startMemory && endMemory) {
    result.memoryUsage = {
      used: endMemory.used,
      total: endMemory.total,
      delta: endMemory.used - startMemory.used
    };
  }
  
  return result;
}

/**
 * Compare multiple functions performance
 */
export async function benchmarkCompare<T extends unknown[], R>(
  functions: Array<{
    name: string;
    fn: (...args: T) => R | Promise<R>;
  }>,
  args: T,
  options: BenchmarkOptions = {}
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  
  for (const { name, fn } of functions) {
    const result = await benchmark(name, fn, args, options);
    results.push(result);
  }
  
  return results.sort((a, b) => b.opsPerSecond - a.opsPerSecond);
}

/**
 * Time a function execution
 */
export async function time<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  return { result, duration };
}

/**
 * Time with high precision using process.hrtime if available
 */
export async function timeHighPrecision<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number; hrTime?: [number, number] }> {
  let hrStart: [number, number] | undefined;
  
  if (typeof process !== 'undefined' && process.hrtime) {
    hrStart = process.hrtime();
  }
  
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  const response: { result: T; duration: number; hrTime?: [number, number] } = {
    result,
    duration
  };
  
  if (hrStart && typeof process !== 'undefined' && process.hrtime) {
    response.hrTime = process.hrtime(hrStart);
  }
  
  return response;
}

/**
 * Get memory usage statistics
 */
function getMemoryUsage(): { used: number; total: number } {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      used: usage.heapUsed,
      total: usage.heapTotal
    };
  }
  
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as typeof performance & { 
      memory: { usedJSHeapSize?: number; totalJSHeapSize?: number } 
    }).memory;
    return {
      used: memory.usedJSHeapSize || 0,
      total: memory.totalJSHeapSize || 0
    };
  }
  
  return { used: 0, total: 0 };
}

/**
 * Performance profiler for marking and measuring
 */
export class Profiler {
  private marks = new Map<string, number>();
  private measures = new Map<string, number>();
  
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }
  
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      throw new Error(`Start mark "${startMark}" not found`);
    }
    
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (endMark && !endTime) {
      throw new Error(`End mark "${endMark}" not found`);
    }
    
    const duration = (endTime || performance.now()) - startTime;
    this.measures.set(name, duration);
    return duration;
  }
  
  getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }
  
  getAllMeasures(): Map<string, number> {
    return new Map(this.measures);
  }
  
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
  
  clearMarks(): void {
    this.marks.clear();
  }
  
  clearMeasures(): void {
    this.measures.clear();
  }
}
