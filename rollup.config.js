import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const config = [
  {
    input: {
      index: 'src/index.ts',
      array: 'src/array.ts',
      function: 'src/function.ts',
      object: 'src/object.ts',
      string: 'src/string.ts',
      type: 'src/type.ts',
      performance: 'src/performance.ts'
    },
    output: {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
      preserveModules: false
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ],
    external: []
  },
  {
    input: {
      index: 'src/index.ts',
      array: 'src/array.ts',
      function: 'src/function.ts',
      object: 'src/object.ts',
      string: 'src/string.ts',
      type: 'src/type.ts',
      performance: 'src/performance.ts'
    },
    output: {
      dir: 'dist',
      format: 'es'
    },
    plugins: [dts()],
    external: []
  }
];

export default config;