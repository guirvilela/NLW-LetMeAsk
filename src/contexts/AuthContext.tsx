import firebase from 'firebase';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '../services/firebase';

type AuthContextProp = {
  user: UserAuthProps | undefined;
  signInWithGoogle: () => Promise<void>;
};
type UserAuthProps = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextProp);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserAuthProps>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account');
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
