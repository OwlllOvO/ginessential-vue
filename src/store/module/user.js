import storageService from '@/service/storageService';
import userService from '@/service/userService';

const userModule = {
  namespaced: true,
  state: {
    token: storageService.get(storageService.USER_TOKEN),
    userInfo: storageService.get(storageService.USER_INFO) ? JSON.parse(storageService.get(storageService.USER_INFO)) : null, // eslint-disable-line
  },
  mutations: {
    SET_TOKEN(state, token) {
      // update local cache

      storageService.set(storageService.USER_TOKEN, token);

      // update state

      state.token = token;
    },
    SET_USERINFO(state, userInfo) {
      // update local cache

      storageService.set(storageService.USER_INFO, JSON.stringify(userInfo));

      // update state

      state.userInfo = userInfo;
    },
    SET_USERID(state, userid) {
      // Update local cache
      storageService.set(storageService.USER_ID, userid); // 假设有这样一个常量

      // Update state
      state.userid = userid;
    },
  },

  actions: {
    register(context, { name, telephone, password }) {
      return new Promise((resolve, reject) => {
        userService.register({ name, telephone, password }).then((res) => {
          // Save Token
          context.commit('SET_TOKEN', res.data.data.token);
          context.commit('SET_USERID', res.data.data.userid);
          return userService.info();
        }).then((res) => {
          // Save user info
          context.commit('SET_USERINFO', res.data.data.user);
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    login(context, { telephone, password }) {
      return new Promise((resolve, reject) => {
        userService.login({ telephone, password }).then((res) => {
          // Save Token
          context.commit('SET_TOKEN', res.data.data.token);
          context.commit('SET_USERID', res.data.data.userid);
          return userService.info();
        }).then((res) => {
          // Save user info
          console.log(res);
          context.commit('SET_USERINFO', res.data.data.user);
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    logout({ commit }) {
      // Clear token
      commit('SET_TOKEN', '');
      storageService.set(storageService.USER_TOKEN, '');
      // Clear user info
      commit('SET_USERINFO', '');
      storageService.set(storageService.USER_INFO, '');
      commit('SET_USERID', '');
      storageService.set(storageService.USER_ID, '');

      window.location.reload();
    },
  },
};

export default userModule;
