import crypto from 'crypto';
import '@testing-library/jest-dom/extend-expect';

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: []) => crypto.randomBytes(arr.length),
  },
});

jest.mock('next/router', () => require('next-router-mock'));
