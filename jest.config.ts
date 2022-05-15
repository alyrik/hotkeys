import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const ignoredModules = ['uuid'].join('|');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config.InitialOptions = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
    'mjs',
    'cjs',
    'jsx',
    'node',
  ],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.ts'],
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

const generateConfig = async () => {
  const nextJestConfig = await createJestConfig(customJestConfig)();
  return {
    ...nextJestConfig,
    transformIgnorePatterns: [
      '^.+\\.module\\.(css|sass|scss)$',
      `node_modules/(?!${ignoredModules})`,
    ],
  };
};

export default generateConfig;
