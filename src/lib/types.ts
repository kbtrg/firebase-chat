export type Maybe<T> = T | null;

export type User = {
  uid: string;
  name: string;
  imageUrl: string;
};

export type Chat = {
  uid: string;
  message: string;
};
