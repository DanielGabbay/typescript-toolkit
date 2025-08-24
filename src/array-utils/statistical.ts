/**
 * Statistical functions for arrays of numbers
 */

/**
 * Calculate sum of numbers
 */
export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Calculate mean (average)
 */
export function mean(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN;
  return sum(numbers) / numbers.length;
}

/**
 * Calculate median
 */
export function median(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN;
  
  const sorted = numbers.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculate mode (most frequent value(s))
 */
export function mode(numbers: readonly number[]): number[] {
  if (numbers.length === 0) return [];
  
  const counts = new Map<number, number>();
  for (const num of numbers) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }
  
  const maxCount = Math.max(...counts.values());
  return [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([num]) => num);
}

/**
 * Calculate range (max - min)
 */
export function range(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN;
  return Math.max(...numbers) - Math.min(...numbers);
}

/**
 * Calculate variance
 */
export function variance(numbers: readonly number[], sample = false): number {
  if (numbers.length === 0) return NaN;
  if (numbers.length === 1) return sample ? NaN : 0;
  
  const avg = mean(numbers);
  const squaredDiffs = numbers.map(num => Math.pow(num - avg, 2));
  const divisor = sample ? numbers.length - 1 : numbers.length;
  
  return sum(squaredDiffs) / divisor;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(numbers: readonly number[], sample = false): number {
  return Math.sqrt(variance(numbers, sample));
}

/**
 * Calculate percentile
 */
export function percentile(numbers: readonly number[], p: number): number {
  if (numbers.length === 0) return NaN;
  if (p < 0 || p > 100) throw new Error('Percentile must be between 0 and 100');
  
  const sorted = numbers.slice().sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate quartiles (Q1, Q2, Q3)
 */
export function quartiles(numbers: readonly number[]): [number, number, number] {
  return [
    percentile(numbers, 25),
    percentile(numbers, 50),
    percentile(numbers, 75)
  ];
}

/**
 * Calculate interquartile range (IQR)
 */
export function interquartileRange(numbers: readonly number[]): number {
  const [q1, , q3] = quartiles(numbers);
  return q3 - q1;
}

/**
 * Detect outliers using IQR method
 */
export function outliers(numbers: readonly number[]): number[] {
  const [q1, , q3] = quartiles(numbers);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return numbers.filter(num => num < lowerBound || num > upperBound);
}

/**
 * Calculate Z-scores
 */
export function zScores(numbers: readonly number[]): number[] {
  const avg = mean(numbers);
  const std = standardDeviation(numbers);
  
  if (std === 0) return numbers.map(() => 0);
  
  return numbers.map(num => (num - avg) / std);
}

/**
 * Normalize array to [0, 1] range
 */
export function normalize(numbers: readonly number[]): number[] {
  if (numbers.length === 0) return [];
  
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  
  if (range === 0) return numbers.map(() => 0);
  
  return numbers.map(num => (num - min) / range);
}

/**
 * Calculate correlation coefficient between two arrays
 */
export function correlation(x: readonly number[], y: readonly number[]): number {
  if (x.length !== y.length || x.length === 0) return NaN;
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  const numerator = sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY)));
  const denominatorX = sum(x.map(xi => Math.pow(xi - meanX, 2)));
  const denominatorY = sum(y.map(yi => Math.pow(yi - meanY, 2)));
  
  const denominator = Math.sqrt(denominatorX * denominatorY);
  
  return denominator === 0 ? NaN : numerator / denominator;
}

/**
 * Calculate covariance between two arrays
 */
export function covariance(x: readonly number[], y: readonly number[], sample = false): number {
  if (x.length !== y.length || x.length === 0) return NaN;
  if (x.length === 1) return sample ? NaN : 0;
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  const covarSum = sum(x.map((xi, i) => (xi - meanX) * (y[i] - meanY)));
  const divisor = sample ? x.length - 1 : x.length;
  
  return covarSum / divisor;
}

/**
 * Get summary statistics
 */
export interface SummaryStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  variance: number;
  standardDeviation: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
}

export function summaryStats(numbers: readonly number[]): SummaryStats {
  if (numbers.length === 0) {
    return {
      count: 0,
      sum: NaN,
      mean: NaN,
      median: NaN,
      mode: [],
      min: NaN,
      max: NaN,
      range: NaN,
      variance: NaN,
      standardDeviation: NaN,
      q1: NaN,
      q2: NaN,
      q3: NaN,
      iqr: NaN
    };
  }
  
  const [q1, q2, q3] = quartiles(numbers);
  
  return {
    count: numbers.length,
    sum: sum(numbers),
    mean: mean(numbers),
    median: median(numbers),
    mode: mode(numbers),
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    range: range(numbers),
    variance: variance(numbers),
    standardDeviation: standardDeviation(numbers),
    q1,
    q2,
    q3,
    iqr: interquartileRange(numbers)
  };
}