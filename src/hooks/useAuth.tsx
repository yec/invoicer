import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";

const initialValue = { loaded: false };

export type AuthContextProps = {
  user?: User;
  password?: string;
  loaded?: boolean;
};

export const AuthContext = React.createContext<AuthContextProps>(initialValue);

export const shortName = (name: string | null) => {
  const [firstname, lastname] = name?.split(" ") || ["?"];

  if (firstname.length < 3) {
    return firstname;
  }

  if (lastname) {
    return firstname.substr(0, 1) + lastname.substr(0, 1);
  }

  return firstname.substr(0, 1);
};

export function signInGoogle() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export function signOut() {
  const auth = getAuth();
  auth.signOut();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = React.useState<AuthContextProps>(initialValue);
  React.useEffect(() => {
    const config = {
      apiKey: "AIzaSyC5jEf_W2gb0peBeCEoFzavUOvCnXNOBcg",
      authDomain: "invoicer-316210.firebaseapp.com",
    };
    initializeApp(config);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          setValue({
            user,
            password: (idTokenResult.claims.cloudant_password as string) || "",
            loaded: true,
          });
        });
      } else {
        setValue({ loaded: true });
      }
    });
  }, []);

  /**
   * Sign in anonymously
   */
  // React.useEffect(() => {
  //   if (!value.user) {
  //     const auth = getAuth();
  //     signInAnonymously(auth);
  //   }
  // }, [value.user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
