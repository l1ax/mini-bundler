import {Bundler} from '../../core';
import {CopyAssetsPlugin} from './plugins';

export const buildConfig: Bundler.IOptions = {
    entry: '../index.ts',
    context: process.cwd(),
    outputs: '../dist/bundle.js',
    plugins: [new CopyAssetsPlugin()]
}