import {Bundler} from '../../core';
import {cssLoader, tsLoader, HTMLPlugin} from '../../core';

export const buildConfig: Bundler.IOptions = {
    entry: '../index.ts',
    context: process.cwd(),
    output: {
        path: '../dist',
        fileName: 'bundle.js'
    },
    plugins: [new HTMLPlugin()],
    loaders: {
        css: [cssLoader, tsLoader]
    }
}