import * as ts from "typescript";
import { Loader } from "../../model/loader";

export class TSLoader extends Loader implements Loader.ILoader {
    run(rawContent: string, filePath: string): string {
         // 使用 TypeScript 编译器 API 编译代码
        const transpiled = ts.transpileModule(rawContent, {
            compilerOptions: {
            module: ts.ModuleKind.ES2015,
            target: ts.ScriptTarget.ES5,
            },
        });
        return transpiled.outputText;
    }
}

export const tsLoader = new TSLoader();