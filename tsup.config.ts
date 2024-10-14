import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  target: "es2020",
  minify: true,
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  outDir: "dist",
  entry: ["async-replace.ts"],
  esbuildOptions: (options) => {
    if (options.format === "cjs") {
      options.footer = {
        js: "module.exports = module.exports.default;",
      };
    }
  },
}));
