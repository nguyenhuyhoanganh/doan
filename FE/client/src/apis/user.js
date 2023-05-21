import http from "../axios";

export const violation = (uid) => http.put(`/users/punish-violation/${uid}`);

export const login = (body) => {
  return http.post(`/login`, body);
};
export const infoUser = (uid) => http.get(`/users/${uid}`);

export const logout = () => http.post(`/logout`);
export const register = (body) => http.post(`/register`, body);

export const updateInfo = (Uid, body) => http.put(`/users/modify/${Uid}`, body);
