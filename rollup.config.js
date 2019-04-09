import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";

export default {
  input: "src/main.ts",
  plugins: [typescript()],
  output: [{ file: pkg.main, format: "cjs" }],
};
