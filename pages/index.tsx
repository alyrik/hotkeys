import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Row,
  Spacer,
  Text,
  TextProps,
  Tooltip,
} from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';

import { CookieKey } from '@/config/cookies';
import { themeStyles } from '@/config/theme';

import styles from './IndexPage.module.scss';
import { buildUserIdCookie } from '@/helpers/buildCookie';

interface IIndexPageProps {
  screenNumber: number;
}

const textProps: Partial<TextProps> = {
  size: 18,
  css: {
    '@sm': {
      fontSize: 22,
    },
  },
};

const IndexPage: NextPage<IIndexPageProps> = ({ screenNumber }) => {
  const router = useRouter();

  function handleStartButtonClick() {
    router.push('/survey');
  }

  return (
    <Container
      as="main"
      direction="column"
      display="flex"
      justify="space-between"
      style={{ minHeight: '100%', paddingTop: 40, paddingBottom: 100 }}>
      <Container
        direction="column"
        display="flex"
        justify="center"
        css={{ flex: '1', maxWidth: 800, p: 0 }}>
        <Row justify="center" align="center">
          <Text
            h1
            size={36}
            css={{
              textGradient: themeStyles.textGradient,
              letterSpacing: '$normal',
              '@sm': {
                fontSize: 56,
              },
            }}
            weight="bold">
            Hotkeys to success
          </Text>
        </Row>
        <Spacer y={1} />
        <Row>
          <Text {...textProps}>
            <Tooltip
              portalClassName={styles.tooltip}
              className={styles.tooltipWrapper}
              color="secondary"
              contentColor="primary"
              as="span"
              placement="topStart"
              keepMounted={true}
              enterDelay={200}
              content={
                <Text size={16}>
                  A code editor is the main tool of every developer. Master it
                  perfectly to boost your productivity and get real pleasure
                  from coding!
                </Text>
              }>
              To code fast and elegant
            </Tooltip>{' '}
            you need to know your editor functionality and effectively use it
            with your keyboard — that’s where{' '}
            <strong>keyboard shortcuts</strong> may help.
          </Text>
        </Row>
        <Spacer y={1} />
        <Row>
          <Text {...textProps}>
            Assess your knowledge by taking this survey. It includes{' '}
            <strong>48 examples</strong> of what you can (and should) do in{' '}
            <Tooltip
              portalClassName={styles.tooltip}
              className={styles.tooltipWrapper}
              color="secondary"
              contentColor="primary"
              as="span"
              keepMounted={true}
              enterDelay={200}
              content={
                <Text size={16}>
                  It doesn&apos;t matter which editor you use. All popular
                  editors have functionality mentioned in the survey or at least
                  something equal. We have used <strong>WebStorm</strong>{' '}
                  to prepare these examples.
                </Text>
              }>
              your editor
            </Tooltip>
            .
          </Text>
        </Row>
        <Spacer y={2} />
        <Row justify="center" align="center">
          <Button color="gradient" size="xl" onClick={handleStartButtonClick}>
            {screenNumber > 1 ? 'Continue your survey!' : 'Take the survey!'}
          </Button>
        </Row>
      </Container>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async ({
  req,
  res,
}) => {
  const cookiesToSet = [];
  const screenNumber = Number(req.cookies[CookieKey.ScreenNumber]) ?? null;
  const initialUserId = req.cookies[CookieKey.UserId];
  const userId = initialUserId ?? uuidv4();

  if (!initialUserId) {
    cookiesToSet.push(
      buildUserIdCookie(userId, process.env.NODE_ENV === 'production'),
    );
  }

  if (cookiesToSet.length) {
    res.setHeader('Set-Cookie', cookiesToSet);
  }

  return {
    props: {
      screenNumber,
    },
  };
};

export default IndexPage;
