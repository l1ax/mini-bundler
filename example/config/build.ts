import fs from "fs";
import { Bundler, createBundler } from '../../core';
import {buildConfig} from './buildConfig';

const bundler: Bundler = createBundler(buildConfig);


const result = bundler.run();

fs.writeFileSync('../dist/bundle.js', result);