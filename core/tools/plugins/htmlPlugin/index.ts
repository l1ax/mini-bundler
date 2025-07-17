/**
 * @file html模板插件，将构建产物注入到html模板
 */
import path from 'path';
import {Bundler, Plugin} from '../../..';
import fs from 'fs';

function getRelativePathToSourceFile(fromFile: string, toPath: string): string {
    const fromDirectory = path.dirname(fromFile);
    let relativePath = path.relative(fromDirectory, toPath);

    // 确保路径以 './' 开头
    if (!relativePath.startsWith(".")) {
        relativePath = "./" + relativePath;
    }

    return relativePath;
}

export class HTMLPlugin extends Plugin implements Plugin.IPlugin {
    apply(bundler: Bundler): void {
        bundler.hooks.afterRun.tap('HTMLPlugin', () => {
            const bundleJsPath: string = path.resolve(bundler.stats.outputPath, bundler.stats.outputFileName);
            
            if (!bundleJsPath) {
                return;
            }

            const htmlOutputPath: string = path.resolve(bundleJsPath, '../index.html');

            const htmlTemplatePath: string = path.resolve(__dirname, 'template.html');

            let htmlTemplateContent: string = fs.readFileSync(htmlTemplatePath, "utf-8");

            const bundleJSRelativePath: string = getRelativePathToSourceFile(htmlOutputPath, bundleJsPath);

            htmlTemplateContent = htmlTemplateContent.replace("{{ bundleJSPath }}", bundleJSRelativePath);

            fs.writeFileSync(htmlOutputPath, htmlTemplateContent);
        })
    }
}