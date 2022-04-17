import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';
import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from 'react-query';

import { IMAGE_HOST } from '@/config/config';
import Layout from '../components/Layout/Layout';

const queryClient = new QueryClient();

// TODO: google analytics
// TODO: bugsnag
// TODO: OG

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Very hot keys! Test your hotkeys skills</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Must-use hotkeys for every developer"
          />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="preconnect" href={IMAGE_HOST} />
        </Head>
        <CssBaseline />
        <NextNProgress
          color="#ff5a22"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
          options={{ showSpinner: false }}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </NextUIProvider>
  );
}

export default MyApp;
