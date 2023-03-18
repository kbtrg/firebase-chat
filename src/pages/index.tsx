import type { NextPage } from 'next'
import { Heading } from '@chakra-ui/react'
import Head from 'next/head'

const Page: NextPage = () => {
  return (
    <div>
      <Head>
        <title>firebaseチャット</title>
        <meta name="description" content="課題用のチャットアプリです。" />
        <meta property="og:title" content="firebaseチャット" />
        <meta property="og:description" content="課題用のチャットアプリです。" />
        <meta property="og:image" content="/ms-library/images/og-image.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="content-language" content="ja" />
        <link rel="shortcut icon" href="/ms-library/favicon.ico" />
      </Head>
      <Heading>Chakra UI</Heading>
    </div>
  )
}

export default Page
