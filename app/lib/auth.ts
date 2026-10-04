import Cookies from "js-cookie";

export const TOKEN_KEY = "siliconmotives_admin_token";

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, path: "/" }); // 7 days
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}

export function isAuthenticated() {
  return !!getToken();
}
