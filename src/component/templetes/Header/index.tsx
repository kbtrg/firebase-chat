import {
  Avatar,
  chakra,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "@firebase/util";
import { Navigate } from "@src/component/atoms/Navigate/Navigate";
import { useUsersContext } from "@src/component/contexts/UsersContext";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import { useRouter } from "@src/hooks/useRouter/useRouter";
import { getAuth, signOut } from "firebase/auth";

export const Header = () => {
  const { user } = useAuthContext();
  const users = useUsersContext();
  const _user = users.filter((_user) => _user.uid === user?.uid)[0];
  const toast = useToast();
  const { push } = useRouter();

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      toast({
        title: "ログアウトしました。",
        status: "success",
        position: "top",
      });
      push((path) => path.$url());
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
    }
  };

  return (
    <chakra.header py={4} bgColor={"blue.600"}>
      <Flex px={4}>
        <Navigate href={(path) => path.$url()}>
          <chakra.a
            _hover={{
              opacity: 0.8,
            }}
          >
            <Heading color={"white"}>Firebase Chat</Heading>
          </chakra.a>
        </Navigate>
        <Spacer aria-hidden />
        {user && !user.isAnonymous && (
          <Menu>
            <MenuButton>
              <Avatar
                src={_user?.imageUrl ?? ""}
                flexShrink={0}
                width={10}
                height={10}
              />
            </MenuButton>
            <MenuList py={0}>
              <MenuItem onClick={() => push((path) => path.mypage.$url())}>
                ユーザー設定
              </MenuItem>
              <MenuItem onClick={handleSignOut}>ログアウト</MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>
    </chakra.header>
  );
};
