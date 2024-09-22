import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: null,
    user: null,
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // Replace with your actual API endpoint
        const response = await axios.post('https://your-api-url.com/login', credentials);
        const { token, user } = response.data;

        // Commit mutations to update state
        commit('SET_TOKEN', token);
        commit('SET_USER', user);

        // Store the token in localStorage or Cookies
        localStorage.setItem('token', token);
        return true;  // Return true on success
      } catch (error) {
        console.error('Error logging in:', error);
        return false;  // Return false on failure
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
});
