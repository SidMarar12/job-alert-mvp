// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/src/**/__tests__/**/*.(spec|test).(ts|tsx)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/'
  ],
};

