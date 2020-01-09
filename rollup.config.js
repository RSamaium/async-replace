import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'async-replace.js',
    output: {
        format: 'umd',
        file: 'dist/async-replace.min.js',
        name: 'asyncReplace'
    },
    plugins: [
        babel(),
        terser()
    ]
};