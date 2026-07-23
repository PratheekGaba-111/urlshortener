export const TOKEN_KEY = "token";

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem(TOKEN_KEY));
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
