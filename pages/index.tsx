import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Container, Row } from '@nextui-org/react';

import { CookieKey } from '@/config/cookies';

interface IIndexPageProps {
  isAdmin: boolean;
  userId: string;
  screenNumber: number;
}

const IndexPage: NextPage<IIndexPageProps> = ({
  isAdmin,
  userId,
  screenNumber,
}) => {
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
            {screenNumber > 1 ? 'Continue your survey!' : 'Take survey!'}
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
  const screenNumber = Number(req.cookies[CookieKey.ScreenNumber]) ?? null;
  const isAdmin = userId === process.env.ADMIN_TOKEN;

  return {
    props: {
      isAdmin,
      userId,
      screenNumber,
    },
  };
};

export default IndexPage;
