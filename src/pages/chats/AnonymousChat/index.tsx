import {
  Avatar,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text
} from "@chakra-ui/react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { AuthGuard } from "@src/feature/auth/component/AuthGuard/AuthGuard";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import type { Chat } from "@src/lib/types";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = Record<"chatInfo", Chat>

export const AnonymousChat = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const db = getDatabase();
  const dbChatRef = ref(db, `chat/anonymousChat`);
  const { user } = useAuthContext();
  const uid = user?.uid ?? "";

  // メッセージ保存
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await push(dbChatRef, {
        uid,
        message
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
    }
  };

  // メッセージ読み込み
  const [chats, setChats] = useState<Chat[]>([]);
  useEffect(() => {
    try {
      return onChildAdded(dbChatRef, (snapshot) => {
        const chatInfo = snapshot.val() ?? {};
        setChats((prev) => [...prev, chatInfo]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  const Message: React.FC<Message> = ({ chatInfo }: Message) => {
    return (
      <Flex alignItems={"start"}>
        <Avatar/>
        <Flex h={"48px"} ml={2} justify="center" align="center">
          <Text bgColor={user?.uid === chatInfo.uid ? "green.200" : "white"} rounded={"md"} px={2} py={1}>
            {chatInfo.message}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <AuthGuard>
      <Container
        pt={10}
        pb={5}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        minHeight={0}
        bg="blue.100"
      >
        <Heading>匿名チャット</Heading>
        <Spacer flex={"none"} height={4} aria-hidden />
        <Flex
          flexDirection={"column"}
          overflowY={"auto"}
          gap={2}
          ref={messagesElementRef}
        >
          {chats.map((chat, index) => (
            <Message chatInfo={chat} key={`ChatMessage_${index}`} />
          ))}
        </Flex>
        <Spacer aria-hidden />
        <Spacer height={2} aria-hidden flex={"none"} />
        <chakra.form
          bg={"white"}
          p={3}
          display={"flex"}
          gap={2}
          onSubmit={handleSendMessage}
        >
          <Input
            placeholder="Aa"
            bg={"gray.100"}
            borderColor={"white"}
            borderWidth={2}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (e.target.value === "") {
                setIsDisabled(true);
              } else {
                setIsDisabled(false);
              }
            }}
          />
          <Button type={"submit"} disabled={isDisabled} bg={"blue.300"}>
            送信
          </Button>
        </chakra.form>
      </Container>
    </AuthGuard>
  );
};

export default AnonymousChat;
