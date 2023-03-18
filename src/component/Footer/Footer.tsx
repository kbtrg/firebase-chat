import { Button, chakra, Container, Flex, Link } from '@chakra-ui/react'
import { Navigate } from '@src/component/Navigate/Navigate'

export const Footer = () => {
  return (
    <chakra.footer py={5} bgColor={'blue.600'} color={'white'}>
      <Container maxW={'container.lg'}>
        <Flex flexDirection={'column'} gap={2} alignItems={'start'}>
          <Navigate href={(path) => path.$url()}>
            <Button colorScheme='teal'>
              <Link lineHeight={1}>トップページ</Link>
            </Button>
          </Navigate>
          <Navigate href={(path) => path.chat.$url()}>
            <Button colorScheme='teal'>
              <Link lineHeight={1}>チャット</Link>
            </Button>
          </Navigate>
        </Flex>
      </Container>
    </chakra.footer>
  )
}
