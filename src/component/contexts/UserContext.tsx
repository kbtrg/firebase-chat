import { getDatabase, onValue, ref } from "@firebase/database";
import { useAuthContext } from "@src/feature/auth/provider/AuthProvider";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

export type User = {
  uid: string;
  name: string;
  imageUrl: string;
};

const UserContext = createContext<User>({
  uid: "",
  name: "",
  imageUrl: "",
});

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
  const [name, setName] = useState<User["name"]>("");
  const [imageUrl, setImageUrl] = useState<User["imageUrl"]>("");
  
  const { user } = useAuthContext();
  const uid = user?.uid;
  const db = getDatabase();
  const dbRef = ref(db, `user/${uid}`);

  // userName設定
  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      const _name = snapshot.val()?.name
      setName(_name);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // imageUrl設定
  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      const _imageUrl = snapshot.val()?.imageUrl
      setImageUrl(_imageUrl);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  console.log({
    uid: uid ?? "",
    name,
    imageUrl,
  })

  return (
    <UserContext.Provider
      value={{
        uid: uid ?? "",
        name,
        imageUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
