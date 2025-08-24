/**
 * Performance utility functions
 */

// Timing utilities
export function time<T>(fn: () => T): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, duration: end - start };
}

export async function timeAsync<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, duration: end - start };
}

// Benchmark utilities
export function benchmark<T>(
  fn: () => T,
  iterations = 1000
): { average: number; min: number; max: number; total: number } {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const total = times.reduce((sum, time) => sum + time, 0);
  const average = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { average, min, max, total };
}

export async function benchmarkAsync<T>(
  fn: () => Promise<T>,
  iterations = 100
): Promise<{ average: number; min: number; max: number; total: number }> {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const total = times.reduce((sum, time) => sum + time, 0);
  const average = total / iterations;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  return { average, min, max, total };
}

// Memory utilities
export function measureMemory<T>(fn: () => T): { result: T; memoryUsed?: number } {
  const memBefore = (performance as any).memory?.usedJSHeapSize;
  const result = fn();
  const memAfter = (performance as any).memory?.usedJSHeapSize;
  
  return {
    result,
    memoryUsed: memBefore && memAfter ? memAfter - memBefore : undefined
  };
}

// Performance timer class
export class PerformanceTimer {
  private startTime?: number;
  private endTime?: number;
  
  start(): this {
    this.startTime = performance.now();
    this.endTime = undefined;
    return this;
  }
  
  stop(): this {
    if (!this.startTime) {
      throw new Error('Timer not started');
    }
    this.endTime = performance.now();
    return this;
  }
  
  get duration(): number {
    if (!this.startTime) {
      throw new Error('Timer not started');
    }
    return (this.endTime || performance.now()) - this.startTime;
  }
  
  reset(): this {
    this.startTime = undefined;
    this.endTime = undefined;
    return this;
  }
}