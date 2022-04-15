import React from 'react';
import Link from 'next/link';

import styles from './Layout.module.scss';
import { Container, Link as UiLink, Row, Text } from '@nextui-org/react';

interface ILayoutProps {
  children: JSX.Element;
}

const Layout = ({ children }: ILayoutProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link href="/">
          <a className={styles.headerLink}>
            <span>🔥</span>🔑
          </a>
        </Link>
      </header>
      <main className={styles.content}>{children}</main>
      <Container css={{ padding: '15px 0' }} className={styles.footer}>
        <Row justify="center" align="center">
          <Text size={14} css={{ letterSpacing: '$normal' }}>
            © Created by{' '}
            <UiLink
              href="https://www.linkedin.com/in/kiryl-anokhin-462aab114/"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary">
              Kiryl Anokhin
            </UiLink>{' '}
            in 2022
          </Text>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
