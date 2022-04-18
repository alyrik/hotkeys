import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';
import { CssBaseline } from '@nextui-org/react';
import React from 'react';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    const isProd = process.env.NODE_ENV === 'production';

    return (
      <Html lang="en">
        <Head>
          {CssBaseline.flush()}
          {isProd && (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-5KQWK58');
              `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          {isProd && (
            <>
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-5KQWK58"
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
            </>
          )}
          <Main />
          <NextScript />
          {/*TODO: RECAPTCHA*/}
          {/*<script*/}
          {/*  src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY}`}*/}
          {/*/>*/}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
