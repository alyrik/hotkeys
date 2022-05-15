import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import IndexPage, { getServerSideProps } from '@/pages/index';
import { CookieKey } from '@/config/cookies';
import { buildGetServerSidePropsContext } from './helpers/buildGetServerSidePropsContext';
import { ensureProps } from './helpers/ensureProps';
import { mockNextRouter } from './helpers/mockNextRouter';

const mockedRouter = mockNextRouter();

describe('IndexPage', () => {
  describe('getServerSideProps', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [undefined, 0],
      ['', 0],
      ['0', 0],
      ['1', 1],
      ['24', 24],
    ])(
      'sets relevant screenNumber for ScreenNumber cookie %s: %i',
      async (cookieValue, expected) => {
        const context = buildGetServerSidePropsContext({
          cookies:
            typeof cookieValue === 'string'
              ? { [CookieKey.ScreenNumber]: cookieValue }
              : {},
        });

        const result = ensureProps(await getServerSideProps(context));

        expect(result.props.screenNumber).toBe(expected);
      },
    );

    it.each([[undefined], ['']])(
      'sets UserId cookie when there is no initial value: %s',
      async (cookieValue) => {
        const context = buildGetServerSidePropsContext({
          cookies: cookieValue ? { [CookieKey.UserId]: cookieValue } : {},
        });

        await getServerSideProps(context);

        expect(context.res.setHeader).toBeCalledTimes(1);
        expect(context.res.setHeader).toBeCalledWith('Set-Cookie', [
          expect.stringMatching(
            /hotkey-user-id=[a-z0-9-]{36}; Max-Age=155520000; Path=\/; HttpOnly/i,
          ),
        ]);
      },
    );

    it('does not set UserId cookie when it is already present', async () => {
      const cookieValue = '123';
      const context = buildGetServerSidePropsContext({
        cookies: { [CookieKey.UserId]: cookieValue },
      });

      await getServerSideProps(context);

      expect(context.res.setHeader).not.toBeCalledWith(
        'Set-Cookie',
        expect.arrayContaining([
          expect.stringMatching(
            `hotkey-user-id=${cookieValue}; Max-Age=155520000; Path=/; HttpOnly`,
          ),
        ]),
      );
    });
  });

  describe('Page', () => {
    it.each([
      [0, 'Take the survey!'],
      [1, 'Take the survey!'],
      [2, 'Continue your survey!'],
      [38, 'Continue your survey!'],
    ])(
      'renders relevant Start button text for screenNumber %i: %s',
      (screenNumber, expectedText) => {
        render(<IndexPage screenNumber={screenNumber} />);

        const button = screen.getByText(expectedText);

        expect(button).toBeInTheDocument();
      },
    );

    it('goes to survey page when Start button is clicked', () => {
      render(<IndexPage screenNumber={0} />);

      const button = screen.getByText('Take the survey!');
      fireEvent.click(button);

      expect(mockedRouter.pathname).toBe('/survey');
    });
  });
});
