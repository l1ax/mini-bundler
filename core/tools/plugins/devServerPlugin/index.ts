/**
 * @file dev server plugin
 */

import {Bundler} from '../../../bundler';
import {Plugin} from './../../../model';
import {DevServer, DevServerOptions} from './core';

export class DevServerPlugin extends Plugin implements Plugin.IPlugin {
    private devServerInstance: DevServer;

    constructor(options?: DevServerOptions) {
        super();

        this.devServerInstance = new DevServer(options);
    }

    apply(bundler: Bundler): void {
        bundler.hooks.afterRun.tap("devServerPlugin", () => {
            this.devServerInstance.run();
        });
    }
}