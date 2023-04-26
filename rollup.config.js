import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "src/index.ts",
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  output: [
    { file: pkg.main, format: "cjs", exports: "default" },
    { file: pkg.module, format: "esm" },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
