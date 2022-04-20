import { initializeApp } from "https://cdn.skypack.dev/firebase/app";

import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "https://cdn.skypack.dev/firebase/firestore";

import { getEncryptionKey, init, onLogin, onLogout } from "./auth.ts";
import { base64ToArrayBuffer, decrypt, encrypt } from "./crypto.ts";

import {
  addPassword,
  authView,
  makePassword,
  passwordSearch,
  passwordsList,
  passwordsView,
  passwordViewer,
} from "./elements.ts";

const firebaseConfig = {
  apiKey: "AIzaSyDDjs9F24IKJ1nyPyzkyZUMEMrlByetJGw",

  authDomain: "simplistic-passwords.firebaseapp.com",

  projectId: "simplistic-passwords",

  storageBucket: "simplistic-passwords.appspot.com",

  messagingSenderId: "602405019926",

  appId: "1:602405019926:web:e45b6340bd54cfb5d53037",

  measurementId: "G-S60FH5HYP0",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

init();

const db = getFirestore();

interface Password {
  name: string;
  domain: string;
  password: string;
  notes: string;
  username: string;
}

let appData: { passwords: Password[] } = { passwords: [] };

let userDoc: ReturnType<typeof doc> | null = null;

let unsub = () => {};

const save = async () => {
  const key = getEncryptionKey();
  if (!key) {
    throw new Error("No Key");
  }

  setDoc(userDoc, await encrypt(JSON.stringify(appData), key));
};

onLogin(async (user) => {
  userDoc = doc(db, "user", user.uid);

  const docData = (await getDoc(userDoc)).data();

  const key = getEncryptionKey();
  if (!key) {
    throw new Error("No Key");
  }
  if (!docData) {
    await setDoc(userDoc, await encrypt(JSON.stringify(appData), key));
  } else {
    const data = await decrypt(
      base64ToArrayBuffer(docData.data),
      base64ToArrayBuffer(docData.iv),
      key,
    );

    try {
      appData = JSON.parse(data);
    } catch (e) {
      appData = { passwords: [] };
    }
  }

  unsub = onSnapshot(userDoc, async (doc: any) => {
    const docData = doc.data();
    if (docData) {
      const data = await decrypt(
        base64ToArrayBuffer(docData.data),
        base64ToArrayBuffer(docData.iv),
        key,
      );

      try {
        appData = JSON.parse(data);
        render();
      } catch (e) {
        console.log("Invalid data", e);
      }
    }
  });

  await save();
});

// Views

onLogin(() => {
  authView.style.display = "none";
  passwordsView.style.display = "flex";
});

onLogout(() => {
  passwordsView.style.display = "none";
  authView.style.display = "block";
  appData = { passwords: [] };
  unsub();
  passwordViewerPassword = null;
  render();
});

// Password Viewer/Editor

let passwordViewerPassword: Password | null = null;
let passwordViewerCreateMode = false;

const closePasswordView = () => {
  passwordViewer.container.style.opacity = "0";
  setTimeout(() => {
    passwordViewer.container.style.display = "none";
  }, 200);
};

const openPasswordView = (password: Password, create = false) => {
  passwordViewerCreateMode = create;
  passwordViewerPassword = password;

  passwordViewer.domain.value = passwordViewerPassword.domain;
  passwordViewer.password.value = passwordViewerPassword.password;
  passwordViewer.username.value = passwordViewerPassword.username;
  passwordViewer.notes.value = passwordViewerPassword.notes;
  passwordViewer.name.value = passwordViewerPassword.name;

  if (create) {
    passwordViewer.remove.style.display = "none";
  } else {
    passwordViewer.remove.style.display = "inline";
  }

  passwordViewer.container.style.display = "flex";
  passwordViewer.container.style.opacity = "0";
  setTimeout(() => {
    passwordViewer.container.style.opacity = "1";
  });
};

passwordViewer.save.addEventListener("click", () => {
  if (!passwordViewerPassword) {
    throw new Error("Not currently editing any password");
  }

  passwordViewerPassword.domain = passwordViewer.domain.value;
  passwordViewerPassword.password = passwordViewer.password.value;
  passwordViewerPassword.username = passwordViewer.username.value;
  passwordViewerPassword.notes = passwordViewer.notes.value;
  passwordViewerPassword.name = passwordViewer.name.value;

  if (passwordViewerCreateMode) {
    appData.passwords.push(passwordViewerPassword);
    passwordViewerCreateMode = false;
  }

  save();
  closePasswordView();
});

passwordViewer.remove.addEventListener("click", () => {
  if (!passwordViewerCreateMode && confirm("Delete?")) {
    appData.passwords = appData.passwords.filter((v) =>
      v !== passwordViewerPassword
    );

    save();
    closePasswordView();
  }
});

passwordViewer.cancel.addEventListener("click", () => {
  closePasswordView();
});

passwordViewer.container.addEventListener("click", () => {
  closePasswordView();
});

passwordViewer.card.addEventListener("click", (ev) => {
  ev.stopPropagation();
});

passwordViewer.show_password.addEventListener("click", () => {
  if (passwordViewer.show_password.textContent === "Hide") {
    passwordViewer.show_password.textContent = "Show";
    passwordViewer.password.type = "password";
  } else {
    passwordViewer.show_password.textContent = "Hide";
    passwordViewer.password.type = "text";
  }
});

// Render

const render = () => {
  passwordsList.innerHTML = "";

  appData.passwords
    .filter((v) =>
      (v.name + v.domain + v.notes + v.username).toLowerCase().includes(
        passwordSearch.value.toLowerCase(),
      )
    )
    .forEach((password) => {
      const el = makePassword();
      passwordsList.appendChild(el.container);

      el.name.textContent = password.name;
      el.domain.textContent = password.domain;
      el.username.textContent = password.username;

      el.view.addEventListener("click", () => {
        openPasswordView(password);
      });
    });
};

// Adding a password

addPassword.addEventListener("click", () => {
  openPasswordView({
    name: "New Password",
    notes: "",
    domain: "example.com",
    password: generateRandomPassword(),
    username: "Your Email",
  }, true);
});

// Util

const generateRandomPassword = (len = 12) => {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890!@#$%^&*()";
  let pass = "";
  for (let i = 0; i < len; i++) {
    const value = crypto.getRandomValues(new Uint8Array(1))[0];
    pass += alphabet[Math.floor(value / 255 * alphabet.length)];
  }
  return pass;
};

// Search

passwordSearch.addEventListener("input", () => {
  render();
});
