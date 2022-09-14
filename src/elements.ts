const ensure = <T extends HTMLElement>(
  q: string,
  on = document.body,
) => {
  const element = on.querySelector(q);
  if (element === null) {
    throw new Error(`Element '${q}' does not exist!`);
  }
  return element as T;
};

type ComponentCreateFunction<T> = (
  ensure: <V extends HTMLElement>(q: string) => V,
  el: HTMLElement,
) => T;

const component = <T>(
  q: string,
  create: ComponentCreateFunction<T>,
): (() => T) =>
  () => {
    const templateEl = ensure<HTMLTemplateElement>(q);
    const el = templateEl.content.firstElementChild?.cloneNode(
      true,
    );
    if (!el) {
      throw new Error("The template '" + q + "' has no child elements");
    }
    return create((q) => ensure(q, el as HTMLElement), el as HTMLElement);
  };

export const makePassword = component("#password-template", (ensure, el) => ({
  container: el,
  name: ensure<HTMLDivElement>(".password-name"),
  domain: ensure<HTMLDivElement>(".password-domain"),
  username: ensure<HTMLDivElement>(".password-username"),
  actions: ensure<HTMLDivElement>(".password-actions"),
  view: ensure<HTMLButtonElement>(".password-view"),
}));

export const passwordViewer = {
  container: ensure<HTMLDivElement>("#password-view-container"),
  card: ensure<HTMLDivElement>("#password-view-card"),
  name: ensure<HTMLInputElement>("#password-view-name"),
  domain: ensure<HTMLInputElement>("#password-view-domain"),
  username: ensure<HTMLInputElement>("#password-view-username"),
  password: ensure<HTMLInputElement>("#password-view-password"),
  show_password: ensure<HTMLButtonElement>("#password-view-show_password"),
  notes: ensure<HTMLTextAreaElement>("#password-view-notes"),
  save: ensure<HTMLButtonElement>("#password-view-save"),
  cancel: ensure<HTMLButtonElement>("#password-view-cancel"),
  remove: ensure<HTMLButtonElement>("#password-view-delete"),
};

export const authView = ensure<HTMLDivElement>(
  "#auth-view",
);

export const login = {
  view: ensure<HTMLDivElement>("#login-view"),
  email: ensure<HTMLInputElement>("#login-email"),
  password: ensure<HTMLInputElement>("#login-password"),
  submit: ensure<HTMLButtonElement>("#login-submit"),
  switch: ensure<HTMLButtonElement>("#login-switch-to-signup"),
};

export const signup = {
  view: ensure<HTMLDivElement>("#signup-view"),
  email: ensure<HTMLInputElement>("#signup-email"),
  password: ensure<HTMLInputElement>("#signup-password"),
  confirmPassword: ensure<HTMLInputElement>("#signup-confirm-password"),
  submit: ensure<HTMLButtonElement>("#signup-submit"),
  switch: ensure<HTMLButtonElement>("#signup-switch-to-login"),
};

export const logout = ensure<HTMLButtonElement>("#logout");

export const passwordsView = ensure<HTMLDivElement>("#passwords-view");
export const passwordsList = ensure<HTMLDivElement>("#passwords-list");

export const error = ensure<HTMLDivElement>("#error");

export const addPassword = ensure<HTMLButtonElement>("#add-password");

export const changePassword = ensure<HTMLButtonElement>("#change-password");
export const passwordChanger = {
  container: ensure<HTMLDivElement>("#password-changer"),
  card: ensure<HTMLDivElement>("#password-changer-card"),
  password: ensure<HTMLInputElement>("#password-changer-password"),
  confirmPassword: ensure<HTMLInputElement>(
    "#password-changer-confirm-password",
  ),
  submit: ensure<HTMLButtonElement>("#password-changer-submit"),
  cancel: ensure<HTMLButtonElement>("#password-changer-cancel"),
};

export const passwordSearch = ensure<HTMLInputElement>("#password-search");
