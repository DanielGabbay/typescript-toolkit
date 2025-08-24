import { vi } from 'vitest';

// הפיכת vi.fn לזמין כ-jest.fn
(globalThis as any).jest = {
  fn: vi.fn,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  runAllTimers: vi.runAllTimers,
};
