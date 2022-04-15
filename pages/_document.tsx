import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {process.env.NODE_ENV === 'production' && <>{/* TODO: GTM */}</>}
        </Head>
        <body>
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
