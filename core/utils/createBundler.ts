import {Bundler} from '../bundler';
import { ModuleParser } from '../moduleParser/index';
import { DependencyGraphController } from '../depGraphController';

export const createBundler: (
    options: Bundler.IOptions
) => Bundler = (options: Bundler.IOptions) => {
    const moduleParser = new ModuleParser(options);
    const dependencyGraphController = new DependencyGraphController();
    const bundler = new Bundler(moduleParser, dependencyGraphController, options);

    return bundler;
}