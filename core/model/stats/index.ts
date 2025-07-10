/**
 * @file 上下文交互信息，提供给plugin访问
 */

export class Stats {
    /** 编译产物 */
    output: string | undefined;

    setOutput(output: string) {
        this.output = output;
    }
}