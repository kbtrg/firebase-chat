import {
  Avatar,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  HStack,
  Input,
  Spacer,
  Tag,
  TagLabel,
  Text
} from "@chakra-ui/react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { useUsersContext } from "@src/component/contexts/UsersContext";
import { AuthGuard } from "@src/feature/auth/component/AuthGuard/AuthGuard";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import type { Chat } from "@src/lib/types";
import type { GetServerSideProps } from "next";
import { FormEvent, useEffect, useRef, useState } from "react";

type CustomMessage = Record<"chatInfo", Chat>;

type Props = {
  id: string;
};

export const GroupChat: React.FC<Props> = ({ id }) => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const db = getDatabase();
  const dbChatRef = ref(db, `chat/groupChat/${id}`);
  const { user } = useAuthContext();
  const uid = user?.uid ?? "";
  const users = useUsersContext();

  // メッセージ保存
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await push(dbChatRef, {
        uid,
        message,
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

  // メッセージスクロール
  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  const CustomMessage: React.FC<CustomMessage> = ({ chatInfo }: CustomMessage) => {
    const messageOwner = users.filter((user) => user.uid === chatInfo.uid)[0];

    return (
      <Flex alignItems={"start"} mb={2}>
        <Avatar src={messageOwner?.imageUrl ?? ""} />
        <Container>
          <Text fontSize={"14px"} height={4} mt={-1}>
            {messageOwner?.name}
          </Text>
          <Text
            display={"inline-block"}
            bgColor={user?.uid === messageOwner?.uid ? "green.200" : "white"}
            rounded={"md"}
            mt={2}
            px={2}
            py={1}
          >
            {chatInfo.message}
          </Text>
        </Container>
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
        <HStack spacing={4}>
          <Tag variant="subtle" colorScheme="orangez">
            <TagLabel>グループID : {id}</TagLabel>
          </Tag>
        </HStack>
        <Heading>グループチャット</Heading>
        <Spacer flex={"none"} height={4} aria-hidden />
        <Flex
          flexDirection={"column"}
          overflowY={"auto"}
          gap={2}
          ref={messagesElementRef}
        >
          {chats.map((chat, index) => (
            <CustomMessage chatInfo={chat} key={`ChatMessage_${index}`} />
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      id: params ? params["id"] : "",
    },
  };
};

export default GroupChat;
