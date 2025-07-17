/**
 * @file 上下文交互信息，提供给plugin访问
 */

export class Stats {
    /** 编译产物 */
    output: string | undefined;

    /** 编译产物路径 */
    outputPath: string = '';

    /** 编译产物名称（目前都是编译到一个js文件，不涉及分chunk */
    outputFileName: string = ''

    setOutput(output: string, outputPath: string, outputFileName: string) {
        this.output = output;
        this.outputPath = outputPath;
        this.outputFileName = outputFileName;
    }
}