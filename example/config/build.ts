import fs from "fs";
import { Bundler, createBundler } from '../../core';
import {buildConfig} from './buildConfig';

const bundler: Bundler = createBundler(buildConfig);


const result = bundler.start();

fs.writeFileSync('../dist/bundle.js', result);