import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "index.js",
    external: ["react", "react-dom"],
    output: {
      name: "magnoliaReactTemplating",
      file: pkg.browser,
      format: "umd",
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
    plugins: [resolve(), commonjs()],
  },
];
