import {
  AbsoluteCenter,
  Avatar, Button, chakra, Container, Flex, FormControl, Input, useToast
} from '@chakra-ui/react'
import { getDatabase, push, ref as databaseRef } from '@firebase/database'
import { FirebaseError } from '@firebase/util'
import type { Maybe } from '@src/lib/types'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytesResumable } from "firebase/storage"
import type { NextPage } from 'next/types'
import { FormEvent, useEffect, useState } from 'react'

const FirebaseChat: NextPage = () => {
  const toast = useToast()
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [image, setImage] = useState<Maybe<File>>();
  const [userName, setUserName] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<Maybe<number>>(null);

  useEffect(() => {
    setIsDisabled(!Boolean(image && userName))
  }, [image, userName])
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // firebase storageに画像を保存
      if(!image) return
      const storage = getStorage()
      const _storageRef = storageRef(storage, image.name);
      const uploadTask = uploadBytesResumable(_storageRef, image);
      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress)
        },
        (error) => {
          alert(error);
        },
        () => {
          // firebase realtime databaseにユーザー名と登録画像のパスを保存
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const db = getDatabase()
            const dbNameRef = databaseRef(db, `user/name`)
            const dbImageRef = databaseRef(db, `user/imageUrl/${userName}`)
            await push(dbNameRef, {
              userName,
            })
            await push(dbImageRef, {
              downloadURL,
            })
          });
        }
      )
      if(uploadProgress === 100) {
        toast({
          title: '情報を更新しました。',
          status: 'success',
          position: 'top',
        })
      }
    } catch (e) {
      toast({
        title: 'エラーが発生しました。',
        status: 'error',
        position: 'top',
      })
      if (e instanceof FirebaseError) {
        console.log(e)
      }
    }
  }

  return (
    <Container py={14}>
      <AbsoluteCenter axis='both' display={"grid"}>
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
              placeholder='ユーザー名'
              mt={5}
              mb={10}
              onChange={(e) => setUserName(e.target.value)}
            />
          </FormControl>
          <Button type='submit' colorScheme='teal' width={"90%"} disabled={isDisabled}>保存</Button>
        </chakra.form>
      </AbsoluteCenter>
    </Container>
  )
}

export default FirebaseChat
