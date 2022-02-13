import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Container, Row, Text } from '@nextui-org/react';

import { CookieKey } from '../models/CookieKey';

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
      style={{ minHeight: '100%' }}>
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
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async ({
  req,
}) => {
  const userId = req.cookies[CookieKey.UserId] ?? null;
  const isAdmin = userId === process.env.ADMIN_TOKEN;

  return {
    props: {
      isAdmin,
      userId,
    },
  };
};

export default IndexPage;
