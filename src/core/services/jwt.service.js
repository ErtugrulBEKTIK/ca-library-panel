import ApiService from "@/core/services/api.service";

const ID_TOKEN_KEY = "id_token";
const ID_USER_KEY = "id_user";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
  ApiService.setHeader()
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const getUser = () => {
  const rawUser = window.localStorage.getItem(ID_USER_KEY);
  if(rawUser)
    return JSON.parse(rawUser);
  else{
    return {}
  }
};

export const saveUser = user => {
  window.localStorage.setItem(ID_USER_KEY, JSON.stringify(user));
};

export const destroyUser = () => {
  window.localStorage.removeItem(ID_USER_KEY);
};

export default { getToken, saveToken, destroyToken, getUser, saveUser, destroyUser };
