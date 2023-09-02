const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
  ],
  plugins: [
    resolve(), //处理第三方模块引入
    commonjs(), //处理npm 是commonjs
    babel({ babelHelpers: "bundled" }),
  ],
};
