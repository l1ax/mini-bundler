import {Bundler} from '../../core';
import {cssLoader, tsLoader, CopyAssetsPlugin} from '../../core';

export const buildConfig: Bundler.IOptions = {
    entry: '../index.ts',
    context: process.cwd(),
    outputs: '../dist/bundle.js',
    plugins: [new CopyAssetsPlugin()],
    loaders: {
        css: [cssLoader, tsLoader]
    }
}