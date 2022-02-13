import React from 'react';

import styles from './Layout.module.scss';
import { Container, Link, Row, Text } from '@nextui-org/react';

interface ILayoutProps {}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      <main className={styles.content}>{children}</main>
      <Container css={{ padding: '15px 0' }} className={styles.footer}>
        <Row justify="center" align="center">
          <Text size={14} css={{ letterSpacing: '$normal' }}>
            © Created by{' '}
            <Link
              href="https://www.linkedin.com/in/kiryl-anokhin-462aab114/"
              target="_blank"
              rel="noopener noreferrer"
              color="secondary">
              Kiryl Anokhin
            </Link>{' '}
            in 2022
          </Text>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
