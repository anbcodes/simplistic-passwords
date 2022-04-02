import { error } from "./elements.ts";

error.style.display = "none";
error.style.display = "0";

export const displayError = (s: string) => {
  error.style.display = "";
  error.style.opacity = "0";
  setTimeout(() => error.style.opacity = "1");
  error.textContent = s;
  setTimeout(() => {
    error.style.opacity = "0";
    setTimeout(() => {
      error.style.display = "none";
      error.textContent = "";
    }, 200);
  }, 4000);
};
