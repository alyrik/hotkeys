import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';
import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from 'react-query';

import { IMAGE_HOST, screenMapping } from '@/config/config';
import Layout from '../components/Layout/Layout';

const screenEntries = Object.entries(screenMapping);
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <QueryClientProvider client={queryClient}>
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
        <NextNProgress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default MyApp;
