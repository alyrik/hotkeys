import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';
import NextNProgress from 'nextjs-progressbar';
import { QueryClient, QueryClientProvider } from 'react-query';

import { IMAGE_HOST } from '@/config/config';
import Layout from '../components/Layout/Layout';

const queryClient = new QueryClient();

// TODO: Change gradient colors to more orange
// TODO: google analytics
// TODO: RECAPTCHA
// TODO: bugsnag

function MyApp({ Component, pageProps }: AppProps) {
  const title = 'Very hot keys! Test your skills';

  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>{title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Must-use hotkeys for every developer"
          />
          <meta
            name="keywords"
            content="hotkeys, keyboard shortcuts, IDE, productivity, WebStorm, VSCode, code editor, survey"
          />
          <meta property="og:site_name" content="hotkeys.guru" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content={title} />
          <meta
            property="og:description"
            content="Must-use hotkeys for every developer"
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:card" content="summary_large_image" />
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
