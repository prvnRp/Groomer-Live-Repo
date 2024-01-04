const TOKEN_NAME = "_groomer_payment_";

/**
 * The function `removeToken` removes the "salon_client_token" item from the localStorage.
 */
export const removePayment = () => {
  localStorage.removeItem(TOKEN_NAME);
};

/**
 * The addToken function sets a token value in the localStorage.
 * @param token - The `token` parameter is a Object that represents a token value.
 */
export const addPayment = (token) => {
  localStorage.setItem(TOKEN_NAME, JSON.stringify(token));
};

/**
 * The function `getToken` retrieves a token from the session storage.
 * @returns The function `getToken` returns the value stored in the `x` variable, which is retrieved
 * from the `localStorage` using the `getItem` method.
 */
export const getPayment = () => {
  let x = localStorage.getItem(TOKEN_NAME);
  x = JSON.parse(x);
  return x;
};
