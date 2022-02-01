import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={createTheme({ type: 'dark' })}>
      <CssBaseline />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
