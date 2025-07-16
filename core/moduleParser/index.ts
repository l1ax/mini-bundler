/**
 * @file parser 模块解析类
 */

import { transformFromAstSync } from "@babel/core";
import traverse from "@babel/traverse";
import path from 'path';
import fs from "fs";
import { Module } from '../model/module';
import * as parser from "@babel/parser";
import * as BabelType from '@babel/types';
import {Bundler} from '../bundler';
import {Loader} from '../model';

export class ModuleParser implements ModuleParser.IParser {

    constructor(public options: Bundler.IOptions) {}

    /** 读取文件，解析文件，创建模块 */
    createModule(filePath: string): Module {
        const module: Module = new Module();
        module.filePath = filePath;

        let fileContent: string = '';
        const dependencies: string[] = [];
        const fileExtension: string = path.extname(filePath);
        // if (fileExtension === ".js" || fileExtension === ".ts") {
            
        // }
        // 读取文件
        const absolutePath = path.resolve(this.options.context, filePath);
        fileContent = fs.readFileSync(absolutePath, { encoding: "utf-8" });

        if (this.options.loaders?.[fileExtension]) {
            fileContent = this.applyLoaders(fileContent, filePath, this.options.loaders);
        }

            // 解析文件，获取依赖
        const ast = parser.parse(fileContent, {
            // 具有esm语法的要用module
            sourceType: "module"
        });

        // es6 -> es5
        const {code} = transformFromAstSync(ast, fileContent, {
            presets: ["@babel/preset-env"]
        }) || {};

        fileContent = code || fileContent;

        traverse(ast, {
            // import 语法解析
            ImportDeclaration({node}) {
                // 形如 '../aModule/index.ts'
                dependencies.push(node.source.value);
            },
            // commonjs
            CallExpression({node}) {
                // 形如 '../aModule/index.ts'
                if (
                    node.callee.name === 'require'
                    && node.callee.type === 'Identifier'
                ) {
                    if (BabelType.isStringLiteral(node.arguments[0])) {
                        dependencies.push(node.arguments[0].value);
                    }
                }
            }
        });

        module.content = fileContent;

        module.dependencies = dependencies;
        module.id = path.resolve(filePath);

        // 处理相对路径到绝对路径的映射
        dependencies.forEach(dependency => {
            const fileDir = path.dirname(filePath);
            const absoluteDependencyPath = path.resolve(fileDir, dependency);
            module.mapping[dependency] = absoluteDependencyPath;
        })

        return module;
    }

    /** 应用loader */
    applyLoaders(rawContent: string, filePath: string, loaderMap: Record<string, Loader.ILoader[]>): string {
        const extension: string = path.extname(filePath);
        const loaders: Loader.ILoader[] | undefined = loaderMap[extension];

        if (!loaders) {
            return rawContent;
        }

        /** 链式应用loaders */
        return loaders.reduce((rawContent, loader) => loader.run(rawContent, filePath), rawContent);
    }
}

export namespace ModuleParser {
    export interface IParser {
        /** 读取文件，解析文件，创建模块 */
        createModule(...args: any[]): Module;
        /** 应用loader */
        applyLoaders(rawContent: string, filePath: string, loaderMap: Record<string, Loader.ILoader[]>): string
    }
}