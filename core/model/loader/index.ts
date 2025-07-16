/**
 * @file 文件转化器
 */

export abstract class Loader implements Loader.ILoader {
    /** 源内容 */
    rawContent: string = "";

    /** 转化后内容 */
    transformedContent: string = "";

    constructor() {}

    abstract run(rawContent: string, filePath: string): string 
}

export namespace Loader {
    export interface ILoader {
        /** 源内容 */
        rawContent: string;

        /** 转化后内容 */
        transformedContent: string;

        run(rawContent: string, filePath: string): string;
    }
}