import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  time, timeAsync, benchmark, benchmarkAsync, measureMemory, PerformanceTimer 
} from '../src/performance';

describe('performance utilities', () => {
  describe('time', () => {
    it('should measure synchronous function execution time', () => {
      const slowFunction = () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = time(slowFunction);
      
      expect(result.result).toBe(499500); // Sum of 0 to 999
      expect(result.duration).toBeGreaterThan(0);
      expect(typeof result.duration).toBe('number');
    });

    it('should handle functions that throw errors', () => {
      const throwingFunction = () => {
        throw new Error('Test error');
      };

      expect(() => time(throwingFunction)).toThrow('Test error');
    });
  });

  describe('timeAsync', () => {
    it('should measure async function execution time', async () => {
      const asyncFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'done';
      };

      const result = await timeAsync(asyncFunction);
      
      expect(result.result).toBe('done');
      expect(result.duration).toBeGreaterThan(5); // At least 5ms
    });

    it('should handle async functions that reject', async () => {
      const rejectingFunction = async () => {
        throw new Error('Async error');
      };

      await expect(timeAsync(rejectingFunction)).rejects.toThrow('Async error');
    });
  });

  describe('benchmark', () => {
    it('should benchmark function performance', () => {
      const simpleFunction = () => Math.sqrt(16);

      const result = benchmark(simpleFunction, 100);
      
      expect(result.average).toBeGreaterThan(0);
      expect(result.min).toBeGreaterThan(0);
      expect(result.max).toBeGreaterThanOrEqual(result.min);
      expect(result.total).toBeGreaterThan(0);
      expect(typeof result.average).toBe('number');
    });

    it('should use default iterations when not specified', () => {
      const fn = vi.fn(() => 42);
      
      benchmark(fn); // Should default to 1000 iterations
      
      expect(fn).toHaveBeenCalledTimes(1000);
    });
  });

  describe('benchmarkAsync', () => {
    it('should benchmark async function performance', async () => {
      const asyncFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 1));
        return 42;
      };

      const result = await benchmarkAsync(asyncFunction, 5); // Small number for test speed
      
      expect(result.average).toBeGreaterThan(0);
      expect(result.min).toBeGreaterThan(0);
      expect(result.max).toBeGreaterThanOrEqual(result.min);
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('measureMemory', () => {
    it('should measure memory usage when available', () => {
      const memoryFunction = () => {
        const arr = new Array(1000).fill(42);
        return arr.length;
      };

      const result = measureMemory(memoryFunction);
      
      expect(result.result).toBe(1000);
      // memoryUsed might be undefined if not supported
      if (result.memoryUsed !== undefined) {
        expect(typeof result.memoryUsed).toBe('number');
      }
    });

    it('should handle functions that throw errors', () => {
      const throwingFunction = () => {
        throw new Error('Memory test error');
      };

      expect(() => measureMemory(throwingFunction)).toThrow('Memory test error');
    });
  });

  describe('PerformanceTimer', () => {
    let timer: PerformanceTimer;

    beforeEach(() => {
      timer = new PerformanceTimer();
    });

    it('should start and stop timer', () => {
      timer.start();
      // Add a small delay
      const start = Date.now();
      while (Date.now() - start < 10) {
        // busy wait
      }
      timer.stop();

      expect(timer.duration).toBeGreaterThan(0);
    });

    it('should get current duration without stopping', () => {
      timer.start();
      const start = Date.now();
      while (Date.now() - start < 5) {
        // busy wait
      }

      const firstDuration = timer.duration;
      expect(firstDuration).toBeGreaterThan(0);
      
      const start2 = Date.now();
      while (Date.now() - start2 < 5) {
        // busy wait
      }
      expect(timer.duration).toBeGreaterThan(firstDuration);
    });

    it('should throw error when getting duration without starting', () => {
      expect(() => timer.duration).toThrow('Timer not started');
    });

    it('should throw error when stopping without starting', () => {
      expect(() => timer.stop()).toThrow('Timer not started');
    });

    it('should reset timer', () => {
      timer.start();
      const start = Date.now();
      while (Date.now() - start < 5) {
        // busy wait
      }
      timer.stop();

      expect(timer.duration).toBeGreaterThan(0);

      timer.reset();
      expect(() => timer.duration).toThrow('Timer not started');
    });

    it('should allow method chaining', () => {
      const result = timer.start().stop().reset();
      expect(result).toBe(timer);
    });
  });
});