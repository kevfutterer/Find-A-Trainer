let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
    // const response = await fetch(
    //   'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiBBQf36o_7TTcugs8gGzscEvXgEdhUc8',
    //   {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       email: payload.email,
    //       password: payload.password,
    //       returnSecureToken: true,
    //     }),
    //   }
    // );
    // const responseData = await response.json();
    // if (!response.ok) {
    //   console.log(responseData);
    //   const error = new Error(
    //     responseData.message || 'Failed to authenticate. Check login data'
    //   );
    //   throw error;
    // }
    // context.commit('setUser', {
    //   token: responseData.idToken,
    //   userId: responseData.localId,
    //   tokenExpiration: responseData.expiresIn,
    // });
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);
    context.commit('setUser', {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup',
    });
    // const response = await fetch(
    //   'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiBBQf36o_7TTcugs8gGzscEvXgEdhUc8',
    //   {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       email: payload.email,
    //       password: payload.password,
    //       returnSecureToken: true,
    //     }),
    //   }
    // );
    // const responseData = await response.json();
    // if (!response.ok) {
    //   const error = new Error(
    //     responseData.message || 'Failed to authenticate. Check login data'
    //   );
    //   throw error;
    // }
    // console.log(responseData);
    // context.commit('setUser', {
    //   token: responseData.idToken,
    //   userId: responseData.localId,
    //   tokenExpiration: responseData.expiresIn,
    // });
  },
  async auth(context, payload) {
    const mode = payload.mode;
    let url =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDiBBQf36o_7TTcugs8gGzscEvXgEdhUc8';
    if (mode === 'signup') {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDiBBQf36o_7TTcugs8gGzscEvXgEdhUc8';
    }
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });
    const responseData = await response.json();
    if (!response.ok) {
      console.log(responseData);
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check login data'
      );
      throw error;
    }
    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;
    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function () {
      context.dispatch('autoLogout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
      // tokenExpiration: expirationDate,
    });
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();
    if (expiresIn < 0) {
      return;
    }
    setTimeout(function () {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId,
      });
    }
  },
  autoLogout(context) {
    context.dispatch('logout');
    context.commit('didLogout');
  },
};
