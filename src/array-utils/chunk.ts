/**
 * Advanced array chunking utilities
 */

/**
 * Split array into chunks of specified size
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error('Chunk size must be greater than 0');
  }
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Split array into a specified number of chunks
 */
export function chunkInto<T>(array: readonly T[], numberOfChunks: number): T[][] {
  if (numberOfChunks <= 0) {
    throw new Error('Number of chunks must be greater than 0');
  }
  
  const chunkSize = Math.ceil(array.length / numberOfChunks);
  return chunk(array, chunkSize);
}

/**
 * Split array at specified indices
 */
export function splitAt<T>(array: readonly T[], ...indices: number[]): T[][] {
  const sortedIndices = [...new Set(indices)].sort((a, b) => a - b);
  const chunks: T[][] = [];
  let start = 0;
  
  for (const index of sortedIndices) {
    if (index > start && index <= array.length) {
      chunks.push(array.slice(start, index));
      start = index;
    }
  }
  
  if (start < array.length) {
    chunks.push(array.slice(start));
  }
  
  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Split array by a predicate function
 */
export function splitBy<T>(
  array: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[][] {
  const chunks: T[][] = [];
  let currentChunk: T[] = [];
  
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    
    if (predicate(item, i)) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = [];
      }
    } else {
      currentChunk.push(item);
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

/**
 * Split array on separator value
 */
export function splitOn<T>(array: readonly T[], separator: T): T[][] {
  return splitBy(array, item => item === separator);
}

/**
 * Sliding window over array
 */
export function slidingWindow<T>(array: readonly T[], windowSize: number): T[][] {
  if (windowSize <= 0) {
    throw new Error('Window size must be greater than 0');
  }
  
  if (windowSize > array.length) {
    return array.length > 0 ? [array.slice()] : [];
  }
  
  const windows: T[][] = [];
  for (let i = 0; i <= array.length - windowSize; i++) {
    windows.push(array.slice(i, i + windowSize));
  }
  return windows;
}

/**
 * Sliding window with step
 */
export function slidingWindowStep<T>(
  array: readonly T[],
  windowSize: number,
  step = 1
): T[][] {
  if (windowSize <= 0) {
    throw new Error('Window size must be greater than 0');
  }
  if (step <= 0) {
    throw new Error('Step must be greater than 0');
  }
  
  const windows: T[][] = [];
  for (let i = 0; i <= array.length - windowSize; i += step) {
    windows.push(array.slice(i, i + windowSize));
  }
  return windows;
}

/**
 * Batch array elements with a maximum batch size and optional batch condition
 */
export function batch<T>(
  array: readonly T[],
  maxBatchSize: number,
  batchCondition?: (item: T, currentBatch: T[]) => boolean
): T[][] {
  if (maxBatchSize <= 0) {
    throw new Error('Max batch size must be greater than 0');
  }
  
  const batches: T[][] = [];
  let currentBatch: T[] = [];
  
  for (const item of array) {
    const shouldStartNewBatch = 
      currentBatch.length >= maxBatchSize ||
      (batchCondition && currentBatch.length > 0 && !batchCondition(item, currentBatch));
    
    if (shouldStartNewBatch) {
      batches.push(currentBatch);
      currentBatch = [];
    }
    
    currentBatch.push(item);
  }
  
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }
  
  return batches;
}
