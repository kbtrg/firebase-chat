import {
  AbsoluteCenter,
  Button, chakra,
  Container, useToast
} from '@chakra-ui/react'
import { FirebaseError } from '@firebase/util'
import { useRouter } from '@src/hooks/useRouter/useRouter'
import { getAuth, signInAnonymously } from 'firebase/auth'
import Head from 'next/head'
import type { NextPage } from 'next/types'
import { FormEvent, useState } from 'react'


const FirebaseChat: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const { push } = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true)
    e.preventDefault()
    try {
      const auth = getAuth()
      await signInAnonymously(auth)
      toast({
        title: '匿名でログインしました。',
        status: 'success',
        position: 'top',
      })
      push((path) => path.chat.$url())
    } catch (e) {
      toast({
        title: 'エラーが発生しました。',
        status: 'error',
        position: 'top',
      })
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>firebaseチャット</title>
        <meta name="description" content="課題用のチャットアプリです。" />
        <meta property="og:title" content="firebaseチャット" />
        <meta property="og:description" content="課題用のチャットアプリです。" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta httpEquiv="content-language" content="ja" />
        <link rel="shortcut icon" href="favicon.ico" />
      </Head>
      <Container py={14}>
        <chakra.form onSubmit={handleSubmit}>
          <AbsoluteCenter p='4' axis='both'>
            <Button type={'submit'} isLoading={isLoading} colorScheme='teal' size='lg'>
              チャットに参加する
            </Button>
          </AbsoluteCenter>
        </chakra.form>
      </Container>
    </div>
  )
}

export default FirebaseChat
