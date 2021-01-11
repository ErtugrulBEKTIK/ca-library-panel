import ApiService from "@/core/services/api.service";
import JwtService from "@/core/services/jwt.service";
// action types
export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const REGISTER = "register";
export const UPDATE_PASSWORD = "updateUser";


const state = {
  errors: null,
  user: JwtService.getUser(),
  isAuthenticated: !!JwtService.getToken()
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  }
};

const actions = {
  login(context, credentials) {
    return new Promise(resolve => {
      ApiService.post("auth/login", credentials)
        .then(({ data }) => {
          // console.log("Here what post returns", data);
          context.commit("setUser", data);
          resolve(true);
        })
        .catch(() => {
          context.commit("setError", 'Lütfen giriş bilgilerinizi kontrol edin!');
          resolve();
        });
    });
  },
  logout(context) {
    context.commit("logOut");
  },
  register(context, credentials) {
    return new Promise(resolve => {
      ApiService.post("auth/register", credentials)
        .then(({ data }) => {
          context.commit("setUser", data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit("setError", response.data.errors);
        });
    });
  },
  verifyAuth(context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.get("verify")
        .then(({ data }) => {
          context.commit("setUser", data);
        })
        .catch(({ response }) => {
          context.commit("setError", response.data.errors);
        });
    } else {
      context.commit("logOut");
    }
  },
  updateUser(context, payload) {
    const password = payload;

    return ApiService.put("password", password).then(({ data }) => {
      context.commit("setPassword", data);
      return data;
    });
  }
};

const mutations = {
  setError(state, error) {
    state.errors = error;
  },
  setUser(state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    JwtService.saveUser(user);
    JwtService.saveToken(user.token);
  },
  setPassword(state, password) {
    state.user.password = password;
  },
  logOut(state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    JwtService.destroyToken();
    JwtService.destroyUser();
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
