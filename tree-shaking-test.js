// Test tree shaking - import only specific functions
import { chunk, unique } from './dist/index.js';

// Use only these functions
const data = [1, 2, 3, 4, 5, 1, 2];
const chunks = chunk(data, 2);
const uniqueData = unique(data);

console.log('Chunks:', chunks);
console.log('Unique:', uniqueData);
