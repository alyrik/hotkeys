import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';

import { IMAGE_HOST, screenMapping } from '../config/config';

const screenEntries = Object.entries(screenMapping);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <Head>
        <title>Very hot keys</title>
        <meta
          name="description"
          content="Must-use hotkeys for every programmer"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href={IMAGE_HOST} />
        {screenEntries.slice(0, 3).map(([key, value]) => (
          <link
            key={key}
            rel="prefetch"
            href={IMAGE_HOST + value.imageSrc}
            as="image"
          />
        ))}
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
