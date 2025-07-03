import {Bundler} from '../../core';

export const buildConfig: Bundler.IOptions = {
    entry: '../index.ts',
    context: process.cwd()
}