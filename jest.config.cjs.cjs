/**
 * Jest configuration for CommonJS distribution tests.
 * Tests the built CJS output in dist/cjs/
 */
module.exports = {
  testMatch: ['**/tests-dist/cjs/**/*.test.cjs'],
  transform: {},
  moduleFileExtensions: ['cjs', 'js'],
  testEnvironment: 'node',
};
