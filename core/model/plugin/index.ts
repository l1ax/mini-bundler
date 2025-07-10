/**
 * @file 插件，通过访问上下文定制化构建过程
 */

import {Bundler} from '../../bundler';

export class Plugin implements Plugin.IPlugin {
    apply(bundler: Bundler): void {
        throw new Error('function apply does not be implemented')
    }
}

export namespace Plugin {
    export interface IPlugin {
        apply(bundler: Bundler): void;
    }
}