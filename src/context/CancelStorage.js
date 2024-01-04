const TOKEN_NAME = "Groomer_payment_cancel";

/**
 * The function `removePaymentToken` removes the "groomer_payment_cancel" item from the sessionStorage.
 */
export const removeCancelToken = () => {
  sessionStorage.removeItem(TOKEN_NAME);
};

/**
 * The addToken function sets a token value in the sessionStorage.
 * @param token - The `token` parameter is a string that represents a token value.
 */
export const addCancelToken = (token) => {
  sessionStorage.setItem(TOKEN_NAME, token);
};

/**
 * The function `getToken` retrieves a token from the session storage.
 * @returns The function `getToken` returns the value stored in the `x` variable, which is retrieved
 * from the `sessionStorage` using the `getItem` method.
 */
export const getCancelToken = () => {
  const x = sessionStorage.getItem(TOKEN_NAME);
  return x;
};
