import Cookie from 'js-cookie';
const TokenKey = 'Authorization';

export function getToken() {
  return Cookie.get(TokenKey);
}
export function setToken(token: string) {
  return Cookie.set(TokenKey, token);
}

export function removeToken() {
  return Cookie.remove(TokenKey);
}
