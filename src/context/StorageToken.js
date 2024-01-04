const TOKEN_NAME = "salon_user_token";

/**
 * The function `removeToken` removes the "salon_client_token" item from the localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_NAME);
};

/**
 * The addToken function sets a token value in the localStorage.
 * @param token - The `token` parameter is a string that represents a token value.
 */
export const addToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token);
};

/**
 * The function `getToken` retrieves a token from the session storage.
 * @returns The function `getToken` returns the value stored in the `x` variable, which is retrieved
 * from the `localStorage` using the `getItem` method.
 */
export const getToken = () => {
  const x = localStorage.getItem(TOKEN_NAME);
  return x;
};
