const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/config/(.*)$': '<rootDir>/config/$1',
    '^@/queries/(.*)$': '<rootDir>/actions/queries/$1',
    '^@/mutations/(.*)$': '<rootDir>/actions/mutations/$1',
    '^@/models/(.*)$': '<rootDir>/models/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/helpers/(.*)$': '<rootDir>/helpers/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
