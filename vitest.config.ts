import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Files that don't need to be or shouldn't be tested because no meaningful tests can be implemented
const sharedIgnoredFiles = [
  "**/src/pages/*",
  "**/src/typing/**/*",
  "node_modules/**/*",
  "packages/template/*",
  "**/src/main.tsx",
  "**/src/**/ApiController.ts",
  "**/src/**/BrowserRouter.tsx",
  "/dist",
];

// Files to be tested once further development happens
const tempIgnoredFiles = ["**/src/features/user-dashboards/reservation-filter/*"];

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        globals: true,
        exclude: [...sharedIgnoredFiles, ...tempIgnoredFiles],
        include: ["**/src/**/*.test.tsx", "**/src/**/*.test.ts"],
        environment: "jsdom",
        silent: true,
        deps: {
          optimizer: {
            web: {
              include: ["vitest-canvas-mock"],
            },
          },
        },
        coverage: {
          provider: "istanbul",
          exclude: [
            "**/src/**/*.test.tsx",
            "**/src/**/*.test.ts",
            ...sharedIgnoredFiles,
            ...tempIgnoredFiles,
          ],
          include: ["**/src/**/*.tsx", "**/src/**/*.ts"],
          reporter: ["text", "lcov"], // Generate lcov and text reports
        },
        reporters: [
          "default", // Vitest's default reporter so that terminal output is still visible
          ["vitest-sonar-reporter", { outputFile: "sonar-report.xml" }],
        ],
        setupFiles: ["./vitest.setup.ts"],
      },
    }),
  ),
);
