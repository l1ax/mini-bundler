/**
 * @file bundler
 */
import { ModuleParser } from '../moduleParser';
import { DependencyGraphController } from '../depGraphController';
import { Hook, Loader, Plugin, Stats } from '../model';
import fs from "fs";
import path from 'path';

/** 模块解析类 */
export class Bundler {

    hooks: Record<Bundler.HookType, Hook> = {
        beforeRun: new Hook(),
        afterRun: new Hook()
    }

    stats: Stats = new Stats();

    constructor(
        private moduleParser: ModuleParser.IParser,
        private depGraphController: DependencyGraphController.IDependencyGraphController,
        private options: Bundler.IOptions,
        private plugins: Array<Plugin.IPlugin>
    ) {
        this.createDependencyGraph();

        this.plugins = this.options.plugins || [];
        this.plugins.forEach(plugin => {
            plugin.apply(this);
        });
    }

    /** 创建模块 */
    createModule(filePath: string) {
        return this.moduleParser.createModule(filePath);
    }

    /** 构建依赖图 */
    createDependencyGraph() {
        return this.depGraphController.createDependencyGraph(
            this.options.entry,
            this.createModule.bind(this)
        );
    }

    /** 打包 */
    bundle(): string {
        let modules = '';

        for (const [absolutePath, module] of this.depGraphController.graph) {
            modules += `
                "${absolutePath}": [
                    function (require, module, exports) {
                        ${module.content}
                    },
                    ${JSON.stringify(module.mapping)}
                ],
            `
        }

        const result = `
            (function(modules) {
                function require(id) {
                    const [fn, mapping] = modules[id];
                    
                    function localRequire(relativePath) {
                        return require(mapping[relativePath]);
                    }

                    const module = {
                        exports: {}
                    };

                    fn(localRequire, module, module.exports);

                    return module.exports;
                }

                require("${this.depGraphController.graph.keys().next().value}")
            })({${modules}})
        `;

        this.stats.setOutput(result, this.options.output.path, this.options.output.fileName);

        const dirPath: string = path.resolve(this.options.context, this.options.output.path);
        const outputPath: string = path.resolve(this.options.context, this.options.output.path, this.options.output.fileName);
        
        if (!(fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory())) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(outputPath, result);

        return result;
    }

    /** 开始构建 */
    run() {
        this.hooks.beforeRun.call();

        const assets = this.bundle();

        this.hooks.afterRun.call();

        return assets;
    }
}

export namespace Bundler {
    export interface IOptions {
        /** 入口文件 */
        entry: string;
        /** 上下文路径 */
        context: string;
        /** 输出路径 */
        output: IOutput;
        /** 插件集合 */
        plugins?: Array<Plugin.IPlugin>;
        /** loaders集合 */
        loaders?: Record<string, Loader.ILoader[]>
    }

    export type HookType = 'beforeRun' | 'afterRun'

    export interface IOutput {
        /** 输出路径 */
        path: string;
        /** 输出文件名 */
        fileName: string;
    }
}