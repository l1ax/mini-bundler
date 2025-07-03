export class Module implements Module.IModule {
    id: string = '';
    filePath: string = '';
    content: string = '';
    dependencies: string[] = [];
    mapping: Record<string, string> = {};

    constructor() {}
}

export namespace Module {
    export interface IModule {
        /** 唯一标识符，例如模块的绝对路径 */
        id: string;
        /** 模块文件的路径 */
        filePath: string;
        /** 模块的源代码 */
        content: string;
        /** 依赖数组，存储依赖模块的路径 */
        dependencies: string[];
        /** 依赖的相对路径和绝对路径的映射关系 */
        mapping: Record<string, string>
    }
}