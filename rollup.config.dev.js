// rollup.config.dev.js
const path = require("path");
const inputPath = path.resolve(__dirname, "./packages/bin/sl-format.js");
const outputPathe = path.resolve(__dirname, "./dist/bin/sl-format.js");
const resolve = require("@rollup/plugin-node-resolve");
// const commonjs = require("rollup-plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const json = require("@rollup/plugin-json");
const copy = require("rollup-plugin-copy");

module.exports = {
  input: inputPath,
  output: {
    file: outputPathe,
    format: "es",
    name: "slFormat",
  },
  plugins: [
    resolve(),
    // commonjs(),
    babel({
      exclude: "node_modules/**", // 表示那些不需要转换
    }),
    json(),
    copy({
      targets: [{ src: "packages/templates/*", dest: "dist/templates/" }],
      dot: true,
    }),
  ],
};
