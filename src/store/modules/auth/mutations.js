export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.didAutoLogout = false;
    // state.tokenExpiration = payload.tokenExpiration;
  },
  didLogout(state) {
    state.didLogout = true;
  },
};
