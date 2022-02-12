import type { GetServerSideProps, NextPage } from 'next';
import { Container, Link, Row, Text } from '@nextui-org/react';

import localDataService from '../services/localDataService';
import { CookieKey } from '../models/CookieKey';
import React from 'react';

interface IIndexPageProps {
  isAdmin: boolean;
  userId: string;
}

const IndexPage: NextPage<IIndexPageProps> = ({ isAdmin, userId }) => {
  return (
    <Container
      as="main"
      direction="column"
      display="flex"
      justify="space-between"
      style={{ minHeight: '100vh' }}>
      <Container
        direction="column"
        display="flex"
        justify="center"
        css={{ flex: '1' }}>
        <Row justify="center" align="center">
          <Text
            h1
            size={56}
            css={{
              textGradient: '45deg, $blue500 -30%, $pink500 60%',
              letterSpacing: '$normal',
            }}
            weight="bold">
            Website is under construction
          </Text>
        </Row>
        <Row justify="center" align="center">
          <Text size={34} css={{ letterSpacing: '$normal' }}>
            Follow the instructions
          </Text>
        </Row>
      </Container>
      <Container css={{ padding: '15px 0' }}>
        <Row justify="center" align="center">
          <Text size={14} css={{ letterSpacing: '$normal' }}>
            © Created by{' '}
            <Link
              href="https://www.linkedin.com/in/kiryl-anokhin-462aab114/"
              target="_blank"
              rel="noopener noreferrer">
              Kiryl Anokhin
            </Link>{' '}
            in 2022
          </Text>
        </Row>
      </Container>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async ({
  req,
}) => {
  const userId = req.cookies[CookieKey.UserId] ?? null;
  const isAdmin = userId === process.env.ADMIN_TOKEN;

  // TODO: redirect if presentation has started
  const initialScreen = localDataService.getCount();

  return {
    props: {
      isAdmin,
      userId,
    },
  };
};

export default IndexPage;
