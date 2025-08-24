// Demo: Only import specific functions to test tree shaking
import { chunk, camelCase } from '@danielgabbay/typescript-toolkit';

// Use only these two functions out of the hundreds available
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunks = chunk(data, 3);
const camelText = camelCase('hello world test');

export { chunks, camelText };
