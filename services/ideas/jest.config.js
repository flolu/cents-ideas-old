module.exports = {
  preset: 'ts-jest',
  //preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  globalSetup: './jest/jest-setup.js',
  globalTeardown: './jest/jest-teardown.js',
  testEnvironment: './jest/jest-mongo.js'
};
