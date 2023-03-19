import { getDatabase, onChildAdded, ref } from '@firebase/database'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

export type User = {
  userName: string
  imageUrl: string
}

const UserContext = createContext<User>({
  userName: "",
  imageUrl: ""
})

type Props = { children: ReactNode }

export const UserProvider = ({ children }: Props) => {
  const userName = useRef<User["userName"]>("")
  const imageUrl = useRef<User["imageUrl"]>("")
  // const [userName, setUserName] = useState<User["userName"]>("")
  // const [imageUrl, setImageUrl] = useState<User["imageUrl"]>("")
  const db = getDatabase()

  useEffect(() => {
    try {
      const dbNameRef = ref(db, `user/name`)
      onChildAdded(dbNameRef, (snapshot) => {
        const _userName = String(snapshot.val()['userName'] ?? '')
        userName.current = _userName
      })
      // setUserName("xxxxxxxx")
    } catch (error) {
      userName.current = ""
      throw error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    (async () => {
      try {
        // const imagePath = await `user/imageUrl/${userName}`
        // const dbImageRef = ref(db, imagePath)
        // onChildAdded(dbImageRef, (snapshot) => {
        //   const _imageUrl = String(snapshot.val()['downloadURL'] ?? '')
        //   setImageUrl(_imageUrl)
        // })
        const path = `aaa/bbb/${userName.current}`
        console.log(path)
        imageUrl.current = path
      } catch (error) {
        imageUrl.current
        throw error
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName.current])

  console.log(userName.current, imageUrl.current)

  return (
    <UserContext.Provider value={{
      userName: userName.current,
      imageUrl: imageUrl.current
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
