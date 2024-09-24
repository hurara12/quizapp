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
        // Load the JSON data containing user credentials (for example purposes)
        const response = await axios.get('/db.json'); // Assuming the db.json file is hosted
        const users = response.data.users; // Assume db.json has a "users" array
        console.log("USer ", users)
        // Find the user with the matching username and password
        const user = users.find(user =>
          user.username === credentials.username && user.password === credentials.password
        );

        if (user) {
          // Simulate a token generation (you can adjust this as needed)
          const token = 'dummy_token_' + user.id;

          // Commit mutations to update state
          commit('SET_TOKEN', token);
          commit('SET_USER', user);

          // Store the token in localStorage
          localStorage.setItem('token', token);

          return true;  // Return true on success
        } else {
          return false;  // Return false if credentials are incorrect
        }
      } catch (error) {
        console.error('Error loading db.json:', error);
        return false;  // Return false on failure
      }
    }
    ,

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