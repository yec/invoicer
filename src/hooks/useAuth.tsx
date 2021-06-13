import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
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

export const AuthContext = React.createContext<
  [
    AuthContextProps,
    React.Dispatch<React.SetStateAction<AuthContextProps>> | null
  ]
>([initialValue, null]);

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

export function useSignInGoogle() {
  const [auth, setAuth] = useContext(AuthContext);
  return () => {
    setAuth && setAuth({ ...auth, loaded: false });
    signInGoogle();
  };
}

export function signOut() {
  const auth = getAuth();
  auth.signOut();
}

export function useAuthState(): [
  AuthContextProps,
  React.Dispatch<React.SetStateAction<AuthContextProps>>
] {
  const [state, setState] = React.useState(initialValue as AuthContextProps);
  // React.useEffect(() => {
  //   db.get<AuthContextProps>("auth").then(({ ...doc }) => {
  //     console.log("doc", doc);
  //     setState(doc);
  //   });
  //   setState(window.localStorage.getItem('invoice_auth'))
  // }, []);
  // const persistState = React.useCallback((value) => {
  //   db.upsert("auth", () => {
  //     const {
  //       user: { uid, photoURL },
  //       ...newDoc
  //     } = value;
  //     return JSON.parse(JSON.stringify({ ...newDoc, user: { uid, photoURL } }));
  //   });
  //   return setState(value);
  // }, []);
  return [state, setState];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useAuthState();
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

  return (
    <AuthContext.Provider value={[value, setValue]}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context[0];
}
