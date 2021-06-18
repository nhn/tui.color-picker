/* eslint-disable strict */
module.exports = {
  moduleFileExtensions: ['js'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.spec.js'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/js/$1'
  },
  setupFilesAfterEnv: ['./test/setup-globals.js']
};
