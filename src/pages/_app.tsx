import type { AppProps } from 'next/app'
import { chakra, ChakraProvider } from '@chakra-ui/react'
import { initializeFirebaseApp } from '@src/lib/firebase/firebase'
import { AuthProvider } from '@src/feature/auth/provider/AuthProvider'
import { Header } from '@src/component/templetes/Header'
import { theme } from '@src/lib/chakra/theme'
import { UserProvider } from '@src/component/contexts/UserContext'

initializeFirebaseApp()
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <UserProvider>
          <Header />
          <chakra.main
            flex={1}
            display={'flex'}
            flexDirection={'column'}
            minHeight={0}
          >
            <Component {...pageProps} />
          </chakra.main>
        </UserProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
