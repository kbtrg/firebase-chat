import type { AppProps } from 'next/app'
import { chakra, ChakraProvider } from '@chakra-ui/react'
import { initializeFirebaseApp } from '@src/lib/firebase/firebase'
import { AuthProvider } from '@src/feature/auth/provider/AuthProvider'
import { Header } from '@src/component/Header/Header'
import { theme } from '@src/lib/chakra/theme'

initializeFirebaseApp()
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Header />
        <chakra.main
          flex={1}
          display={'flex'}
          flexDirection={'column'}
          minHeight={0}
        >
          <Component {...pageProps} />
        </chakra.main>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
