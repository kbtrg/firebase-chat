import { getDatabase, onValue, ref } from "@firebase/database";
import type { User } from "@src/lib/types";
import { entries } from "lodash";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

const UsersContext = createContext<User[]>([]);

type Props = { children: ReactNode };

export const UsersProvider = ({ children }: Props) => {
  const [usersObject, setUsersObject] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const db = getDatabase();
  const dbRef = ref(db, `users`);

  // dbからオブジェクト形式でデータを取得
  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      const _usersObject = snapshot.val()
      setUsersObject(_usersObject);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 配列形式に変更
  useEffect(() => {
    const _users = entries(usersObject).map(user => user[1])
    setUsers(_users);
  }, [usersObject])

  return (
    <UsersContext.Provider
      value={users}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
