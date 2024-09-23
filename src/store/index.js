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
    // Action for logging in
    async login({ commit }, credentials) {
      try {
        // Replace with your actual API endpoint
        const response = await axios.post('db.json', credentials);
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

    // Action for submitting profile data
    async submitProfile({ commit }, formData) {
      try {
        // Replace with your actual API endpoint for profile submission
        const response = await axios.post('YOUR_API_ENDPOINT', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle success (you can commit mutations if needed)
        if (response.status === 200) {
          return true;  // Indicate success
        }
      } catch (error) {
        console.error('Error submitting profile:', error);
        return false;  // Indicate failure
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
});
