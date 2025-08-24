import { beforeEach, describe, expect, it } from "vitest";
import {
  benchmark,
  benchmarkCompare,
  time,
  timeHighPrecision,
  Profiler,
  type BenchmarkOptions,
} from "./benchmark";

describe("performance utilities", () => {
  describe("benchmark", () => {
    it("should benchmark a simple synchronous function", async () => {
      const fn = (x: number) => x * 2;
      const result = await benchmark("multiply", fn, [5], { iterations: 10 });

      expect(result.name).toBe("multiply");
      expect(result.iterations).toBe(10);
      expect(result.executionTime).toBeGreaterThan(0);
      expect(result.opsPerSecond).toBeGreaterThan(0);
      expect(typeof result.opsPerSecond).toBe("number");
    });

    it("should benchmark an asynchronous function", async () => {
      const asyncFn = async (delay: number) => {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return "done";
      };

      const result = await benchmark("async-delay", asyncFn, [1], {
        iterations: 3,
        warmupIterations: 1,
      });

      expect(result.name).toBe("async-delay");
      expect(result.iterations).toBe(3);
      expect(result.executionTime).toBeGreaterThan(0);
      expect(result.opsPerSecond).toBeGreaterThan(0);
    });

    it("should respect timeout option", async () => {
      const slowFn = () => {
        // Simulate some work
        const start = Date.now();
        while (Date.now() - start < 10) {
          // busy wait
        }
      };

      const result = await benchmark("slow-fn", slowFn, [], {
        iterations: 1000,
        timeout: 50,
        warmupIterations: 0,
      });

      expect(result.iterations).toBeLessThan(1000);
      expect(result.executionTime).toBeLessThanOrEqual(100); // Allow some margin
    });

    it("should collect memory stats when requested", async () => {
      const fn = () => {
        // Create some objects to affect memory
        return new Array(1000).fill(0).map((_, i) => ({ id: i }));
      };

      const result = await benchmark("memory-test", fn, [], {
        iterations: 5,
        collectMemoryStats: true,
        warmupIterations: 1,
      });

      expect(result.memoryUsage).toBeDefined();
      expect(result.memoryUsage!.used).toBeGreaterThanOrEqual(0);
      expect(result.memoryUsage!.total).toBeGreaterThanOrEqual(0);
      expect(typeof result.memoryUsage!.delta).toBe("number");
    });

    it("should call beforeEach and afterEach hooks", async () => {
      let beforeCount = 0;
      let afterCount = 0;

      const fn = () => "test";
      const options: BenchmarkOptions = {
        iterations: 3,
        warmupIterations: 1,
        beforeEach: () => {
          beforeCount++;
        },
        afterEach: () => {
          afterCount++;
        },
      };

      await benchmark("hooks-test", fn, [], options);

      // Should be called for warmup + actual iterations
      expect(beforeCount).toBe(4); // 1 warmup + 3 iterations
      expect(afterCount).toBe(4);
    });

    it("should handle functions with no arguments", async () => {
      const fn = () => Math.random();
      const result = await benchmark("no-args", fn, [], { iterations: 5 });

      expect(result.name).toBe("no-args");
      expect(result.iterations).toBe(5);
    });
  });

  describe("benchmarkCompare", () => {
    it("should compare multiple functions and sort by performance", async () => {
      const functions = [
        {
          name: "slow-function",
          fn: (n: number) => {
            let sum = 0;
            for (let i = 0; i < n * 1000; i++) {
              sum += i;
            }
            return sum;
          },
        },
        {
          name: "fast-function",
          fn: (n: number) => (n * 1000 * (n * 1000 - 1)) / 2,
        },
      ];

      const results = await benchmarkCompare(functions, [10], {
        iterations: 5,
        warmupIterations: 1,
      });

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe("fast-function");
      expect(results[1].name).toBe("slow-function");
      expect(results[0].opsPerSecond).toBeGreaterThan(results[1].opsPerSecond);
    });

    it("should handle async functions in comparison", async () => {
      const functions = [
        {
          name: "async-1",
          fn: async (delay: number) => {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return "result1";
          },
        },
        {
          name: "async-2",
          fn: async (delay: number) => {
            await new Promise((resolve) => setTimeout(resolve, delay * 2));
            return "result2";
          },
        },
      ];

      const results = await benchmarkCompare(functions, [1], {
        iterations: 2,
        warmupIterations: 1,
      });

      expect(results).toHaveLength(2);
      // Just check that results are sorted by performance (fastest first)
      expect(results[0].opsPerSecond).toBeGreaterThanOrEqual(
        results[1].opsPerSecond
      );
      // Just verify both have reasonable performance metrics (timing can be inconsistent)
      expect(
        results.find((r) => r.name === "async-1")?.opsPerSecond
      ).toBeGreaterThan(0);
      expect(
        results.find((r) => r.name === "async-2")?.opsPerSecond
      ).toBeGreaterThan(0);
    });

    it("should handle empty functions array", async () => {
      const results = await benchmarkCompare([], []);
      expect(results).toHaveLength(0);
    });
  });

  describe("time", () => {
    it("should time a synchronous function", async () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const { result, duration } = await time(fn);

      expect(result).toBe(499500); // Sum of 0 to 999
      expect(duration).toBeGreaterThan(0);
      expect(typeof duration).toBe("number");
    });

    it("should time an asynchronous function", async () => {
      const asyncFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "async-result";
      };

      const { result, duration } = await time(asyncFn);

      expect(result).toBe("async-result");
      expect(duration).toBeGreaterThan(5);
    });

    it("should handle functions that throw errors", async () => {
      const errorFn = () => {
        throw new Error("Test error");
      };

      await expect(time(errorFn)).rejects.toThrow("Test error");
    });

    it("should handle async functions that reject", async () => {
      const rejectFn = async () => {
        throw new Error("Async error");
      };

      await expect(time(rejectFn)).rejects.toThrow("Async error");
    });
  });

  describe("timeHighPrecision", () => {
    it("should time with high precision", async () => {
      const fn = () => {
        let sum = 0;
        for (let i = 0; i < 100; i++) {
          sum += i;
        }
        return sum;
      };

      const result = await timeHighPrecision(fn);

      expect(result.result).toBe(4950); // Sum of 0 to 99
      expect(result.duration).toBeGreaterThan(0);
      expect(typeof result.duration).toBe("number");

      // hrTime might be available in Node.js environment
      if (result.hrTime) {
        expect(Array.isArray(result.hrTime)).toBe(true);
        expect(result.hrTime).toHaveLength(2);
        expect(typeof result.hrTime[0]).toBe("number");
        expect(typeof result.hrTime[1]).toBe("number");
      }
    });

    it("should handle async functions with high precision", async () => {
      const asyncFn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
        return "precision-result";
      };

      const result = await timeHighPrecision(asyncFn);

      expect(result.result).toBe("precision-result");
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  describe("Profiler", () => {
    let profiler: Profiler;

    beforeEach(() => {
      profiler = new Profiler();
    });

    it("should mark and measure durations", () => {
      profiler.mark("start");

      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 5) {
        // busy wait
      }

      profiler.mark("end");
      const duration = profiler.measure("operation", "start", "end");

      expect(duration).toBeGreaterThan(0);
      expect(profiler.getMeasure("operation")).toBe(duration);
    });

    it("should measure from mark to current time", () => {
      profiler.mark("start");

      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 5) {
        // busy wait
      }

      const duration = profiler.measure("operation", "start");

      expect(duration).toBeGreaterThan(0);
      expect(profiler.getMeasure("operation")).toBe(duration);
    });

    it("should throw error for missing start mark", () => {
      expect(() => {
        profiler.measure("operation", "nonexistent");
      }).toThrow('Start mark "nonexistent" not found');
    });

    it("should throw error for missing end mark", () => {
      profiler.mark("start");
      expect(() => {
        profiler.measure("operation", "start", "nonexistent");
      }).toThrow('End mark "nonexistent" not found');
    });

    it("should return undefined for non-existent measure", () => {
      expect(profiler.getMeasure("nonexistent")).toBeUndefined();
    });

    it("should get all measures", () => {
      profiler.mark("start1");
      profiler.mark("end1");
      profiler.mark("start2");
      profiler.mark("end2");

      profiler.measure("op1", "start1", "end1");
      profiler.measure("op2", "start2", "end2");

      const allMeasures = profiler.getAllMeasures();
      expect(allMeasures.size).toBe(2);
      expect(allMeasures.has("op1")).toBe(true);
      expect(allMeasures.has("op2")).toBe(true);
    });

    it("should clear all marks and measures", () => {
      profiler.mark("test");
      profiler.mark("test2");
      profiler.measure("test-measure", "test", "test2");

      profiler.clear();

      expect(() => profiler.measure("new", "test")).toThrow();
      expect(profiler.getMeasure("test-measure")).toBeUndefined();
    });

    it("should clear only marks", () => {
      profiler.mark("start");
      profiler.mark("end");
      profiler.measure("operation", "start", "end");

      profiler.clearMarks();

      expect(() => profiler.measure("new", "start")).toThrow();
      expect(profiler.getMeasure("operation")).toBeGreaterThan(0);
    });

    it("should clear only measures", () => {
      profiler.mark("start");
      profiler.mark("end");
      profiler.measure("operation", "start", "end");

      profiler.clearMeasures();

      expect(profiler.getMeasure("operation")).toBeUndefined();
      // Should still be able to create new measures with existing marks
      const newDuration = profiler.measure("new-operation", "start", "end");
      expect(newDuration).toBeGreaterThanOrEqual(0);
    });
  });
});
