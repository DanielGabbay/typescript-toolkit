/* eslint-disable @typescript-eslint/no-explicit-any */

import { retry, createCircuitBreaker, createResilientFunction, withTimeout } from './retry';

describe('retry', () => {
  it('should succeed on first try', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    
    const result = await retry(fn);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue('success');
    
    const result = await retry(fn, { initialDelay: 1, jitter: false });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw after max attempts', async () => {
    const error = new Error('persistent failure');
    const fn = jest.fn().mockRejectedValue(error);
    
    await expect(retry(fn, { maxAttempts: 3, initialDelay: 1 })).rejects.toThrow('persistent failure');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should respect retry condition', async () => {
    const retryableError = new Error('retryable');
    const nonRetryableError = new Error('non-retryable');
    
    const fn = jest.fn()
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(nonRetryableError);
    
    await expect(retry(fn, {
      initialDelay: 1,
      retryCondition: (error) => (error as Error).message === 'retryable'
    })).rejects.toThrow('non-retryable');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call onRetry callback', async () => {
    const onRetry = jest.fn();
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    await retry(fn, { onRetry, initialDelay: 1 });
    
    expect(onRetry).toHaveBeenCalledWith(new Error('fail'), 1);
  });

  it('should work with sync functions', async () => {
    let attempts = 0;
    const fn = jest.fn(() => {
      attempts++;
      if (attempts < 3) throw new Error('not ready');
      return 'success';
    });
    
    const result = await retry(fn, { initialDelay: 1 });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('createCircuitBreaker', () => {
  it('should allow calls when circuit is closed', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const circuitBreaker = createCircuitBreaker(fn);
    
    const result = await circuitBreaker();
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should open circuit after failure threshold', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('service error'));
    const circuitBreaker = createCircuitBreaker(fn, { failureThreshold: 3 });
    
    // First 3 failures should open the circuit
    for (let i = 0; i < 3; i++) {
      await expect(circuitBreaker()).rejects.toThrow('service error');
    }
    
    // Circuit should now be open
    await expect(circuitBreaker()).rejects.toThrow('Circuit breaker is OPEN');
    expect(fn).toHaveBeenCalledTimes(3); // No more calls to wrapped function
  });

  it('should close circuit after successful calls in half-open state', async () => {
    jest.useFakeTimers();
    
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('error1'))
      .mockRejectedValueOnce(new Error('error2'))
      .mockResolvedValueOnce('success1')
      .mockResolvedValueOnce('success2')
      .mockResolvedValue('success3');
    
    const circuitBreaker = createCircuitBreaker(fn, { 
      failureThreshold: 2,
      resetTimeout: 1000 
    });
    
    // Open the circuit
    await expect(circuitBreaker()).rejects.toThrow('error1');
    await expect(circuitBreaker()).rejects.toThrow('error2');
    
    // Advance time to allow reset
    jest.advanceTimersByTime(1000);
    
    // First success in half-open
    const result1 = await circuitBreaker();
    expect(result1).toBe('success1');
    
    // Second success should close the circuit
    const result2 = await circuitBreaker();
    expect(result2).toBe('success2');
    
    // Should now work normally (circuit closed)
    const result3 = await circuitBreaker();
    expect(result3).toBe('success3');
    
    jest.useRealTimers();
  });
});

describe('createResilientFunction', () => {
  it('should combine retry and circuit breaker', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue('success');
    
    const resilientFn = createResilientFunction(fn, {
      maxAttempts: 3,
      initialDelay: 1,
      jitter: false
    }, {
      failureThreshold: 5
    });
    
    const result = await resilientFn();
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('withTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve if promise completes before timeout', async () => {
    const promise = new Promise(resolve => 
      setTimeout(() => resolve('success'), 500)
    );
    
    const timeoutPromise = withTimeout(promise, 1000);
    jest.advanceTimersByTime(500);
    
    const result = await timeoutPromise;
    expect(result).toBe('success');
  });

  it('should reject with timeout error if promise takes too long', async () => {
    const promise = new Promise(resolve => 
      setTimeout(() => resolve('success'), 2000)
    );
    
    const timeoutPromise = withTimeout(promise, 1000);
    jest.advanceTimersByTime(1000);
    
    await expect(timeoutPromise).rejects.toThrow('Operation timed out');
  });

  it('should use custom timeout message', async () => {
    const promise = new Promise(() => { /* Never resolves */ }); // Never resolves
    
    const timeoutPromise = withTimeout(promise, 1000, 'Custom timeout message');
    jest.advanceTimersByTime(1000);
    
    await expect(timeoutPromise).rejects.toThrow('Custom timeout message');
  });

  it('should reject with original error if promise rejects first', async () => {
    const error = new Error('Original error');
    const promise = Promise.reject(error);
    
    const timeoutPromise = withTimeout(promise, 1000);
    
    await expect(timeoutPromise).rejects.toThrow('Original error');
  });
});