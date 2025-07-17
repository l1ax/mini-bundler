/**
 * @file dev server 实例
 */

import http from 'http';
import path from 'path';
import fs from 'fs';

export interface DevServerOptions {
    port?: number;
    rootPath?: string;
    dirName?: string;
    hot?: boolean;
}

const defaultOptions: DevServerOptions = {
    port: 3000,
    dirName: "dist",
    rootPath: __dirname,
};

export class DevServer {
    options: DevServerOptions;

    constructor(options?: DevServerOptions) {
        this.options = {
            ...defaultOptions,
            ...options
        }
    }

    run() {
        const server = http.createServer((req, res) => {
            const dirPath: string = path.resolve(this.options.rootPath || __dirname, this.options.dirName!, req.url!);

            let filePath: string = path.join(dirPath, req.url!);

            if (req.url === "/") {
                filePath = path.join(dirPath, "index.html");
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(404);
                    res.end("404 not found");
                    return;
                }

                res.write(data);
                res.end();
            });
        });

        server.listen(this.options.port, () => {
            console.log(`dev server is running on port ${this.options.port}`);
        });
    }
}