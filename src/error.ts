import { error } from "./elements.ts";

export const displayError = (s: string) => {
  error.style.display = "block";
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
