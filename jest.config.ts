/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // <-- Mapea imports .js → .ts automáticamente
  },
  verbose: true,

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
