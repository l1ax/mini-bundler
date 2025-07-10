
            (function(modules) {
                function require(id) {
                    const [fn, mapping] = modules[id];
                    
                    function localRequire(relativePath) {
                        return require(mapping[relativePath]);
                    }

                    const module = {
                        exports: {}
                    };

                    fn(localRequire, module, module.exports);

                    return module.exports;
                }

                require("/Users/chenzhicong/mini-bundler/example/index.ts")
            })({
                "/Users/chenzhicong/mini-bundler/example/index.ts": [
                    function (require, module, exports) {
                        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _require = require('./foo.ts'),
  add = _require.add;
console.log(add(1, 2));

// 将文件当作模块
                    },
                    {"./foo.ts":"/Users/chenzhicong/mini-bundler/example/foo.ts"}
                ],
            
                "/Users/chenzhicong/mini-bundler/example/foo.ts": [
                    function (require, module, exports) {
                        "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var add = function add(a, b) {
  return a + b;
};
module.exports = {
  add: add
};

// 将文件当作模块
                    },
                    {}
                ],
            })
        