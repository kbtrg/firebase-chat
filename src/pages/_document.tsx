import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  override render() {
    return (
      <Html>
        <Head>
          <meta property="og:title" content="ChatApp" />
          <meta
            property="og:description"
            content="課題用のチャットアプリです。"
          />
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta httpEquiv="content-language" content="ja" />

          <meta name="application-name" content="ChatApp" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="ChatApp" />
          <meta name="description" content="課題用のチャットアプリです。" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#042940" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="shortcut icon" href="favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="ChatApp" />
          <meta name="twitter:description" content="課題用のチャットアプリです。" />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="ChatApp" />
          <meta property="og:description" content="課題用のチャットアプリです。" />
          <meta property="og:site_name" content="ChatApp" />
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