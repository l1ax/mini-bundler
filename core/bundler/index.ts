/**
 * @file bundler
 */
import { ModuleParser } from '../moduleParser';
import { DependencyGraphController } from '../depGraphController';

/** 模块解析类 */
export class Bundler {

    constructor(
        public moduleParser: ModuleParser.IParser,
        public depGraphController: DependencyGraphController.IDependencyGraphController,
        public options: Bundler.IOptions
    ) {}

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

        return `
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
        `
    }

    /** 开始构建 */
    start() {
        this.createDependencyGraph();
        return this.bundle();
    }
}

export namespace Bundler {
    export interface IOptions {
        /** 入口文件 */
        entry: string;
        /** 上下文路径 */
        context: string;
    }
}