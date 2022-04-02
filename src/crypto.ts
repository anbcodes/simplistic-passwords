/*
email, password

google_pass = PBKDF2(email + password)

encryption_pass = PBKDF2(password)

*/

export const generateSalt = (len = 16) => {
  return window.crypto.getRandomValues(new Uint8Array(len));
};

export const pbkdf2 = async (password: string, salt: Uint8Array) => {
  const rawPass = new TextEncoder().encode(password);

  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    rawPass,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  const hashed = await window.crypto.subtle.deriveKey(
    {
      salt,
      name: "PBKDF2",
      hash: "SHA-512",
      iterations: 10000,
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  return hashed;
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToArrayBuffer = (str: string) => {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
};

const strToBuf = (str: string) => {
  return new TextEncoder().encode(str);
};

const bufToStr = (buf: ArrayBuffer) => {
  return new TextDecoder().decode(buf);
};

export const base64ToKey = async (base64Key: string) => {
  const raw = base64ToArrayBuffer(base64Key);
  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    {
      name: "AES-GCM",
    },
    true,
    ["encrypt", "decrypt"],
  );
  return key;
};

export const keyToBase64 = async (key: CryptoKey) => {
  const buf = await crypto.subtle.exportKey("raw", key);
  return arrayBufferToBase64(buf);
};

export const encrypt = async (data: string, key: CryptoKey) => {
  const iv = generateSalt(12);
  return {
    data: arrayBufferToBase64(
      await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
        },
        key,
        strToBuf(data),
      ) as ArrayBuffer,
    ),
    iv: arrayBufferToBase64(iv),
  };
};

export const decrypt = async (
  data: ArrayBuffer,
  iv: ArrayBuffer,
  key: CryptoKey,
): Promise<string> => {
  return bufToStr(
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data,
    ),
  );
};
