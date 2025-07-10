/**
 * @file copy产物plugin
 */

import path from 'path';
import {Bundler, Plugin} from '../../../core';
import fs from 'fs';

export class CopyAssetsPlugin extends Plugin implements Plugin.IPlugin {
    apply(bundler: Bundler): void {
        bundler.hooks.afterRun.tap('copyAssets', () => {
            if (bundler.stats.output) {
                fs.writeFileSync(path.resolve(__dirname, '../../dist/copyBundle.js'), bundler.stats.output);
            }
        })
    }
}