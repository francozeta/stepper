import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["packages/stepper/src/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  external: ["react"],
  outDir: "packages/stepper/dist",
  tsconfig: "tsconfig.package.json",
  clean: true,
  splitting: false,
  sourcemap: false,
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
});
