//src\utils\auth.js

export const saveAuthData = ({ access, refresh, user }) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};
