import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    // This suite uses Node's test runner, checked separately in Verify.
    exclude: [...configDefaults.exclude, "benchmarks/browser/interaction-study.test.mjs"],
    setupFiles: ["./test/setup.ts"],
  },
});
