import {
  Avatar, Button, chakra,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text
} from '@chakra-ui/react'
import { getDatabase, onChildAdded, push, ref } from '@firebase/database'
import { FirebaseError } from '@firebase/util'
import { AuthGuard } from '@src/feature/auth/component/AuthGuard/AuthGuard'
import { FormEvent, useEffect, useRef, useState } from 'react'

type MessageProps = {
  message: string
}

const Message = ({ message }: MessageProps) => {
  return (
    <Flex alignItems={'start'}>
      <Avatar name='kubota ryugo' /> {/* src propsに画像のパスを入れて使用する */}
      <Flex h={"48px"} ml={2} justify="center" align="center">
        <Text bgColor={'white'} rounded={'md'} px={2} py={1}>
          {message}
        </Text>
      </Flex>
    </Flex>
  )
}

export const AnonymousChat = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null)
  const [message, setMessage] = useState<string>('')
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const db = getDatabase()
      const dbRef = ref(db, 'anonymousChat')
      await push(dbRef, {
        message,
      })
      setMessage('')
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }

  const [chats, setChats] = useState<{ message: string }[]>([])

  useEffect(() => {
    try {
      const db = getDatabase()
      const dbRef = ref(db, 'anonymousChat')
      return onChildAdded(dbRef, (snapshot) => {
        const message = String(snapshot.val()['message'] ?? '')
        setChats((prev) => [...prev, { message }])
      })
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e)
      }
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    })
  }, [chats])

  return (
    <AuthGuard>
      <Container
        pt={10}
        pb={5}
        flex={1}
        display={'flex'}
        flexDirection={'column'}
        minHeight={0}
        bg="blue.100"
      >
        <Heading>匿名チャット</Heading>
        <Spacer flex={'none'} height={4} aria-hidden />
        <Flex
          flexDirection={'column'}
          overflowY={'auto'}
          gap={2}
          ref={messagesElementRef}
        >
          {chats.map((chat, index) => (
            <Message message={chat.message} key={`ChatMessage_${index}`} />
          ))}
        </Flex>
        <Spacer aria-hidden />
        <Spacer height={2} aria-hidden flex={'none'} />
        <chakra.form bg={"white"} p={3} display={'flex'} gap={2} onSubmit={handleSendMessage}>
          <Input 
            placeholder='Aa'
            bg={"gray.100"}
            borderColor={"white"}
            borderWidth={2}
            value={message} 
            onChange={(e) => {
              setMessage(e.target.value)
              if (e.target.value === "") {
                setIsDisabled(true)
              } else {
                setIsDisabled(false)
              }
            }}
          />
          <Button type={'submit'} disabled={isDisabled} bg={"blue.300"}>送信</Button>
        </chakra.form>
      </Container>
    </AuthGuard>
  )
}

export default AnonymousChat
