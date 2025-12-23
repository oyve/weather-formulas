/**
 * Jest configuration for ESM (ES Modules) distribution tests.
 * Tests the built ESM output in dist/esm/
 */
export default {
  testMatch: ['**/tests-dist/esm/**/*.test.mjs'],
  transform: {},
  moduleFileExtensions: ['mjs', 'js'],
  testEnvironment: 'node',
};
