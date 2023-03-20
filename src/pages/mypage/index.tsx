import {
  AbsoluteCenter,
  Avatar,
  Button,
  chakra,
  Container,
  Flex,
  FormControl,
  Input,
  useToast
} from "@chakra-ui/react";
import { getDatabase, ref as databaseRef, set } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import type { Maybe } from "@src/lib/types";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable
} from "firebase/storage";
import type { NextPage } from "next/types";
import { FormEvent, useEffect, useState } from "react";

const FirebaseChat: NextPage = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [image, setImage] = useState<Maybe<File>>();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setIsDisabled(!Boolean(image && name));
  }, [image, name]);

  const toast = useToast();
  const db = getDatabase();
  const storage = getStorage();
  const { user } = useAuthContext();
  if (!user) return null;
  const uid = user.uid;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // firebase storageに画像を保存
      if (!name || !image) return;
      const _storageRef = storageRef(storage, image.name);
      const uploadTask = uploadBytesResumable(_storageRef, image);
      uploadTask.on(
        "state_changed",
        () => {
          // firebase realtime databaseにユーザー名と登録画像のパスを保存
          getDownloadURL(uploadTask.snapshot.ref).then(async (imageUrl) => {
            const dbRef = databaseRef(db, `user/${uid}`);
            await set(dbRef, {
              name,
              imageUrl
            });
          });
        },
        (error) => {
          alert(error);
        },
      );
      toast({
        title: "情報を更新しました。",
        status: "success",
        position: "top",
      });
    } catch (e) {
      toast({
        title: "エラーが発生しました。",
        status: "error",
        position: "top",
      });
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  return (
    <Container py={14}>
      <AbsoluteCenter axis="both" display={"grid"}>
        <chakra.form onSubmit={handleSubmit} textAlign={"center"}>
          <FormControl>
            <Flex>
              <Avatar src={image ? URL.createObjectURL(image) : ""} />
              <Input
                type={"file"}
                onChange={(e) => {
                  if (e.target.files !== null) {
                    setImage(e.target.files[0]);
                  }
                }}
                height={12}
                p={2}
              />
            </Flex>
          </FormControl>
          <FormControl>
            <Input
              placeholder="ユーザー名"
              mt={5}
              mb={10}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            width={"90%"}
            disabled={isDisabled}
          >
            保存
          </Button>
        </chakra.form>
      </AbsoluteCenter>
    </Container>
  );
};

export default FirebaseChat;
