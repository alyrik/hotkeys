import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Container, Row } from '@nextui-org/react';

import { CookieKey } from '@/config/cookies';

interface IIndexPageProps {
  isAdmin: boolean;
  userId: string;
}

const IndexPage: NextPage<IIndexPageProps> = ({ isAdmin, userId }) => {
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
      style={{ minHeight: '100%' }}>
      <Container
        direction="column"
        display="flex"
        justify="center"
        css={{ flex: '1' }}>
        <Row justify="center" align="center">
          <Button color="gradient" size="xl" onClick={handleStartButtonClick}>
            Take survey!
          </Button>
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
