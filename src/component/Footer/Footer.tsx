import { chakra, Container, Flex, Link } from '@chakra-ui/react'
import { Navigate } from '@src/component/Navigate/Navigate'

export const Footer = () => {
  return (
    <chakra.footer py={10} bgColor={'blue.600'} color={'white'}>
      <Container maxW={'container.lg'}>
        <Flex flexDirection={'column'} gap={5} alignItems={'start'}>
          <Navigate href={(path) => path.$url()}>
            <Link lineHeight={1}>トップページ</Link>
          </Navigate>
          <Navigate href={(path) => path.chat.$url()}>
            <Link lineHeight={1}>チャット</Link>
          </Navigate>
        </Flex>
      </Container>
    </chakra.footer>
  )
}
