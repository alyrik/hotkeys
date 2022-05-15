import mockRouter from 'next-router-mock';

jest.mock('next/router', () => require('next-router-mock'));

export function mockNextRouter() {
  return mockRouter;
}
