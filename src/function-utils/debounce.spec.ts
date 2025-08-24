/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    let callCount = 0;
    const fn = jest.fn(() => {
      callCount++;
      return callCount;
    });

    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(callCount).toBe(1);
  });

  it('should pass correct arguments to debounced function', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    debounced('arg3', 'arg4'); // This should override previous args

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg3', 'arg4');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle leading edge option', () => {
    const fn = jest.fn(() => 'result');
    const debounced = debounce(fn, 100, { leading: true });

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    debounced();
    debounced();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2); // leading + trailing
  });

  it('should handle trailing edge disabled', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100, { leading: true, trailing: false });

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    debounced();
    debounced();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // only leading
  });

  it('should handle maxWait option', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100, { maxWait: 150 });

    debounced();
    
    // Keep calling before delay expires
    jest.advanceTimersByTime(50);
    debounced();
    
    jest.advanceTimersByTime(50);
    debounced();
    
    jest.advanceTimersByTime(50); // Total 150ms - should trigger maxWait
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should provide cancel functionality', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should provide flush functionality', () => {
    const fn = jest.fn(() => 'result');
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    const result = debounced.flush();

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(result).toBe('result');
  });

  it('should provide pending functionality', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    expect(debounced.pending()).toBe(false);

    debounced();
    expect(debounced.pending()).toBe(true);

    jest.advanceTimersByTime(100);
    expect(debounced.pending()).toBe(false);
  });

  it('should handle both leading and trailing', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100, { leading: true, trailing: true });

    debounced();
    expect(fn).toHaveBeenCalledTimes(1); // leading

    debounced();
    debounced();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2); // leading + trailing
  });

  it('should reset timer on subsequent calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced();
    jest.advanceTimersByTime(50);
    
    debounced(); // This should reset the timer
    jest.advanceTimersByTime(50); // Only 50ms more, should not trigger
    
    expect(fn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(50); // Now 100ms from second call
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple debounce instances independently', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    
    const debounced1 = debounce(fn1, 100);
    const debounced2 = debounce(fn2, 200);

    debounced1();
    debounced2();

    jest.advanceTimersByTime(100);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100); // Total 200ms
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});