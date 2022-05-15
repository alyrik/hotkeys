import { GetServerSidePropsContext } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

type Params = {
  cookies?: NextApiRequestCookies;
};

export function buildGetServerSidePropsContext({ cookies = {} }: Params = {}) {
  return {
    req: {
      cookies,
    },
    res: {
      setHeader: jest.fn(),
    },
  } as unknown as GetServerSidePropsContext;
}
