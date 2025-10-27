export default {
    preset: 'ts-jest',
    transform: {
      '^.+\\.ts$': [
        'ts-jest', // Transformer for TypeScript files
        {
          useESM: true, // Enable ES Modules support for TypeScript
        },
      ],
    },
    extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ES modules
    moduleFileExtensions: ['ts', 'js'], // Include both .ts and .js extensions for Jest
    testMatch: ['**/*.test.ts'], // Ensure Jest picks up .test.ts files for tests
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: [
      'src/**/*.ts', // Collect coverage from all TypeScript files in src
      '!src/**/*.d.ts', // Exclude type definition files
    ],
    coverageDirectory: 'coverage', // Output directory for coverage reports
    coverageReporters: ['text', 'lcov', 'html'], // Generate text, lcov, and HTML reports
  };