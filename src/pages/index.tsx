import {
  AbsoluteCenter,
  Button,
  Container,
  Link,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "@firebase/util";
import { Navigate } from "@src/component/atoms/Navigate/Navigate";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import { useRouter } from "@src/hooks/useRouter/useRouter";
import { getAuth, signInAnonymously } from "firebase/auth";
import type { NextPage } from "next/types";
import { useEffect, useState } from "react";

const FirebaseChat: NextPage = () => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const { push } = useRouter();

  const handleAnonymousChat = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      toast({
        title: "匿名でログインしました。",
        status: "success",
        position: "top",
      });
      push((path) => path.chats.AnonymousChat.$url());
    } catch (e) {
      toast({
        title: "エラーが発生しました。",
        status: "error",
        position: "top",
      });
      if (e instanceof FirebaseError) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // レンダリング部分に条件として記述すると、チラつきが発生するのでuseEffectで判定をレンダリング後に遅延
  const [isDisplaySignInAndSignOut, setIsDisplaySignInAndSignOut] =
    useState<boolean>(false);
  useEffect(() => {
    setIsDisplaySignInAndSignOut(!user || user.isAnonymous);
  }, [user]);
  const [isDisplayJoinChatGroup, setIsDisplayJoinChatGroup] =
    useState<boolean>(false);
  useEffect(() => {
    setIsDisplayJoinChatGroup(Boolean(user && !user?.isAnonymous));
  }, [user]);

  return (
    <div>
      <Container py={14}>
        <AbsoluteCenter axis="both" display={"grid"}>
          {!isDisplayJoinChatGroup && (
            <Button
              onClick={handleAnonymousChat}
              isLoading={isLoading}
              colorScheme="teal"
              py={6}
              my={8}
            >
              <Link lineHeight={1}>匿名でチャットに参加</Link>
            </Button>
          )}
          {isDisplaySignInAndSignOut && (
            <>
              <Navigate href={(path) => path.signIn.$url()}>
                <Button isLoading={isLoading} bg={"gray.400"} py={6} my={4}>
                  <Link lineHeight={1}>サインイン</Link>
                </Button>
              </Navigate>
              <Navigate href={(path) => path.signUp.$url()}>
                <Button isLoading={isLoading} bg={"gray.400"} py={6} my={4}>
                  <Link lineHeight={1}>ユーザー登録</Link>
                </Button>
              </Navigate>
            </>
          )}
          {isDisplayJoinChatGroup && (
            <Navigate href={(path) => path.chats.groupChat.edit.$url()}>
              <Button isLoading={isLoading} bg={"gray.400"} py={6} my={4}>
                <Link lineHeight={1}>グループチャットに参加</Link>
              </Button>
            </Navigate>
          )}
        </AbsoluteCenter>
      </Container>
    </div>
  );
};

export default FirebaseChat;
