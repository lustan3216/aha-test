import Cookie from 'js-cookie';
export const TOKEN_KEY = 'Authorization';

export function getToken() {
  return Cookie.get(TOKEN_KEY);
}
export function setToken(token: string) {
  return Cookie.set(TOKEN_KEY, token);
}

export function removeToken() {
  return Cookie.remove(TOKEN_KEY);
}
