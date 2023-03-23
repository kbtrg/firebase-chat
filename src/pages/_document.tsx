import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  override render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <meta name='application-name' content='ChatApp' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='チャットアプリ' />
          <meta name="theme-color" content="#042940" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;