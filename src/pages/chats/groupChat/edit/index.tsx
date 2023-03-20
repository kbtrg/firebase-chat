import {
  AbsoluteCenter,
  Button,
  chakra,
  Container,
  Input,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "@src/hooks/useRouter/useRouter";
import type { Maybe } from "@src/lib/types";
import type { NextPage } from "next/types";
import { useState } from "react";

const FirebaseChat: NextPage = () => {
  const { push } = useRouter();
  const [id, setId] = useState<Maybe<string>>(null);

  return (
    <Container py={14}>
      <AbsoluteCenter axis="both" display={"grid"}>
        <chakra.form
          textAlign={"center"}
          onSubmit={(e) => {
            e.preventDefault();
            if (id) push((path) => path.chats.groupChat._id(id).$url());
          }}
        >
          <Input
            variant="outline"
            placeholder="グループIDを入力してください"
            onChange={(e) => {
              setId(e.target.value);
            }}
            autoFocus
          />
          <Button
            type="submit"
            colorScheme="facebook"
            disabled={!id}
            py={6}
            my={4}
          >
            <Link lineHeight={1}>グループチャットに参加</Link>
          </Button>
        </chakra.form>
      </AbsoluteCenter>
    </Container>
  );
};

export default FirebaseChat;
