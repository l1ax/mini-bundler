/**
 * @file 依赖图控制器
 */

import {Module} from '../model';
import path from 'path';

export class DependencyGraphController implements DependencyGraphController.IDependencyGraphController {

    /** 依赖图 */
    graph: Map<string, Module.IModule> = new Map();

    constructor() {}

    createDependencyGraph(
        entry: string,
        createModule: (filePath: string) => Module.IModule
    ): Map<string,Module.IModule> {
        /** 入口模块 */
        const entryModule = createModule(entry);

        const graph: Map<string, Module.IModule> = new Map();

        const dfs = (module: Module.IModule) => {
            if (graph.has(module.filePath)) {
                return;
            }

            graph.set(module.id, module); 

            module.dependencies.forEach((dependencyPath: string) => {
                // 处理相对路径，因为当前相对路径是相对于声明模块路径的，需要拼接上源文件的相对路径
                const currentModuleRelativePath = path.resolve(
                    module.filePath,
                    '..',
                    dependencyPath
                );
                const dependencyModule = createModule(currentModuleRelativePath);
                dfs(dependencyModule);
            });
        };

        dfs(entryModule);
        
        this.graph = graph;

        return graph;
    }
}

export namespace DependencyGraphController {
    export interface IDependencyGraphController {
        /** 依赖图, key为模块的绝对路径 */
        graph: Map<string, Module.IModule>;

        /**
         * 创建依赖关系图
         * @param
         * @returns 依赖关系图, key为模块的绝对路径, 值为模块对象   
         */
        createDependencyGraph(...args: any[]): Map<string, Module.IModule> ;
    }
}