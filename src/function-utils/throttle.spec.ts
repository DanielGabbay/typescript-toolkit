/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { throttle, throttleSimple } from './throttle';

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throttle function calls', () => {
    const fn = jest.fn(() => 'result');
    const throttled = throttle(fn, 100);

    const result1 = throttled();
    expect(result1).toBe('result'); // Leading edge
    expect(fn).toHaveBeenCalledTimes(1);

    // These calls should be throttled
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    // Advance time and trigger trailing edge
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should pass correct arguments to throttled function', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled('arg1', 'arg2'); // Leading edge
    throttled('arg3', 'arg4'); // Should use these args for trailing

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenNthCalledWith(1, 'arg1', 'arg2');
    expect(fn).toHaveBeenNthCalledWith(2, 'arg3', 'arg4');
  });

  it('should handle leading edge disabled', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100, { leading: false });

    const result = throttled();
    expect(result).toBeUndefined(); // No leading edge
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // Only trailing edge
  });

  it('should handle trailing edge disabled', () => {
    const fn = jest.fn(() => 'result');
    const throttled = throttle(fn, 100, { trailing: false });

    const result = throttled();
    expect(result).toBe('result'); // Leading edge
    expect(fn).toHaveBeenCalledTimes(1);

    throttled(); // This won't trigger trailing

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // Still only leading
  });

  it('should handle both leading and trailing disabled', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100, { leading: false, trailing: false });

    throttled();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should provide cancel functionality', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled(); // Leading edge
    expect(fn).toHaveBeenCalledTimes(1);

    throttled(); // Scheduled for trailing
    throttled.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // No trailing edge
  });

  it('should provide flush functionality', () => {
    const fn = jest.fn(() => 'flushed');
    const throttled = throttle(fn, 100);

    throttled('arg1'); // Leading edge
    throttled('arg2'); // Queued for trailing

    const result = throttled.flush();
    expect(result).toBe('flushed');
    expect(fn).toHaveBeenNthCalledWith(2, 'arg2'); // Should use latest args
  });

  it('should handle rapid successive calls', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    // First call - leading edge
    throttled('call1');
    expect(fn).toHaveBeenCalledTimes(1);

    // Rapid calls during throttle period
    for (let i = 2; i <= 10; i++) {
      throttled(`call${i}`);
    }
    expect(fn).toHaveBeenCalledTimes(1);

    // After throttle period - trailing edge with last args
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'call10');
  });

  it('should work with complex return types', () => {
    const fn = jest.fn(() => ({ data: 'test', timestamp: Date.now() }));
    const throttled = throttle(fn, 100);

    const result1 = throttled();
    expect(result1).toEqual({ data: 'test', timestamp: expect.any(Number) });

    // Subsequent calls during throttle return cached result
    const result2 = throttled();
    expect(result2).toBe(result1); // Same reference
  });

  it('should reset after wait period', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled(); // Leading edge
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100); // Wait for throttle to reset

    throttled(); // Should trigger immediately as new leading edge
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('throttleSimple', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throttle function calls simply', () => {
    const fn = jest.fn();
    const throttled = throttleSimple(fn, 100);

    throttled('arg1');
    throttled('arg2');
    throttled('arg3');

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('arg3'); // Latest args
  });

  it('should use default delay of 16ms', () => {
    const fn = jest.fn();
    const throttled = throttleSimple(fn);

    throttled();

    jest.advanceTimersByTime(16);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should provide cancel functionality', () => {
    const fn = jest.fn();
    const throttled = throttleSimple(fn, 100);

    throttled();
    throttled.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should handle multiple throttle cycles', () => {
    const fn = jest.fn();
    const throttled = throttleSimple(fn, 100);

    // First cycle
    throttled('arg1');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('arg1');

    // Second cycle
    throttled('arg2');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('arg2');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should handle cancel after execution', () => {
    const fn = jest.fn();
    const throttled = throttleSimple(fn, 100);

    throttled();
    jest.advanceTimersByTime(100);

    throttled.cancel(); // Should not throw
    expect(fn).toHaveBeenCalledTimes(1);
  });
});