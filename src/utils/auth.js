import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/auth";
}

export function getValidToken() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) return null;
  return token;
}
