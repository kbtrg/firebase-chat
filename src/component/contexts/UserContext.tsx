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
  userName: string;
  imageUrl: string;
};

const UserContext = createContext<User>({
  uid: "",
  userName: "",
  imageUrl: "",
});

type Props = { children: ReactNode };

export const UserProvider = ({ children }: Props) => {
  const [userName, setUserName] = useState<User["userName"]>("");
  const [imageUrl, setImageUrl] = useState<User["imageUrl"]>("");

  const db = getDatabase();
  const { user } = useAuthContext();
  const uid = user?.uid;

  // userName設定
  useEffect(() => {
    const dbNameRef = ref(db, `user/${uid}/name`);
    onValue(dbNameRef, (snapshot) => {
      const _userName = snapshot.val()
      setUserName(_userName);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // imageUrl設定
  useEffect(() => {
    const dbImageRef = ref(db, `user/${uid}/imageUrl`);
    onValue(dbImageRef, (snapshot) => {
      const _imageUrl = snapshot.val()
      setImageUrl(_imageUrl);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{
        uid: uid ?? "",
        userName,
        imageUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
