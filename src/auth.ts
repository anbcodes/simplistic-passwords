import {
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://cdn.skypack.dev/firebase/auth";

import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "https://cdn.skypack.dev/firebase/firestore";

import { displayError } from "./error.ts";

import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToKey,
  generateSalt,
  keyToBase64,
  pbkdf2,
} from "./crypto.ts";

import { login, logout, signup } from "./elements.ts";

let auth: ReturnType<typeof getAuth> = null;

let user: any | null = null;
let key: CryptoKey | null = null;

const strKey = localStorage.getItem("key");
if (strKey) {
  base64ToKey(strKey).then((k) => key = k);
}

export const init = () => {
  auth = getAuth();
  onAuthStateChanged(auth, (u: any) => {
    user = u;
    if (u) {
      loginListeners.forEach((l) => l(u));
    } else {
      logoutListeners.forEach((l) => l());
    }
  });
};

const loginListeners: ((user: any | null) => void)[] = [];
const logoutListeners: (() => void)[] = [];

export const getUser = (): any | null => user;
export const getEncryptionKey = (): CryptoKey | null => key;
export const onLogin = (listen: (user: any) => void) =>
  loginListeners.push(listen);
export const onLogout = (listen: () => void) => logoutListeners.push(listen);

const handleAuthError = (e: { code: string; message: string }) => {
  if (e.code === AuthErrorCodes.EMAIL_EXISTS) {
    displayError("Email already in use");
  } else if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
    displayError("Invalid password");
  } else if (e.code === AuthErrorCodes.INVALID_EMAIL) {
    displayError("Invalid email");
  } else {
    displayError(e.message);
  }
};

signup.submit.addEventListener("click", async () => {
  const password = signup.password.value;
  const confirmPassword = signup.confirmPassword.value;
  const email = signup.email.value;
  if (
    email.length !== 0 && password.length !== 0 &&
    password === confirmPassword
  ) {
    const googleSalt = generateSalt();
    const googlePassword = await pbkdf2(email + password, googleSalt);
    let user = null;
    try {
      user = await createUserWithEmailAndPassword(
        auth,
        email,
        await keyToBase64(googlePassword),
      );
    } catch (e) {
      handleAuthError(e);
      return;
    }

    const localSalt = generateSalt();
    key = await pbkdf2(password, localSalt);
    localStorage.setItem("key", await keyToBase64(key));

    const db = getFirestore();
    setDoc(doc(db, "salts", email), {
      google: arrayBufferToBase64(googleSalt),
      local: arrayBufferToBase64(localSalt),
      owner: user.user.uid,
    });

    signup.password.value = "";
    signup.confirmPassword.value = "";
    signup.email.value = "";
  } else {
    displayError(
      "Email and password must exist and confirm password must equal password",
    );
  }
});

login.submit.addEventListener("click", async () => {
  const password = login.password.value;
  const email = login.email.value;
  if (email.length !== 0 && password.length !== 0) {
    const db = getFirestore();
    const document = await getDoc(doc(db, "salts", email));
    const data = document.data();
    if (!data) {
      displayError("Account does not exist");
      return;
    }

    const googleSalt = base64ToArrayBuffer(data.google);
    const localSalt = base64ToArrayBuffer(data.local);

    const googlePass = await pbkdf2(email + password, googleSalt);

    const localKey = await pbkdf2(password, localSalt);
    key = localKey;
    localStorage.setItem("key", await keyToBase64(localKey));

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        await keyToBase64(googlePass),
      );
    } catch (e) {
      handleAuthError(e);
      return;
    }

    login.password.value = "";
    login.email.value = "";
  } else {
    displayError("Email and password must exist");
  }
});

logout.addEventListener("click", () => {
  signOut(auth);
  localStorage.removeItem("key");
});

signup.switch.addEventListener("click", () => {
  signup.view.style.display = "none";
  login.view.style.display = "flex";
});

login.switch.addEventListener("click", () => {
  signup.view.style.display = "flex";
  login.view.style.display = "none";
});
