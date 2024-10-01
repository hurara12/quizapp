import { createStore } from 'vuex';
import axios from 'axios';


const url = 'http://192.168.15.76:8000';
//const url = 'https://c9e0-223-123-23-158.ngrok-free.app';


function loadFromLocalStorage(dataToGet) {
  const data = localStorage.getItem(dataToGet) || [];
  return data;
}

function saveToLocalStorage(keyToSave, dataToSave) {
  localStorage.setItem(keyToSave, dataToSave);
}
function deleteFromLocalStorage(dataToRemove) {
  localStorage.removeItem(dataToRemove);
}

export default createStore({
  state: {
    token: null,
    user: null,
    quizesData: [], // Stores all quiz categories
    selectedQuiz: null, // Stores the currently selected quiz
    pendingStudents: [], // Holds the fetched pending students data
    assignedQuiz: [],
  },
  mutations: {
    // Auth Mutations
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      deleteFromLocalStorage('token');
      deleteFromLocalStorage('role');
    },
    quizesData(state, quizzes) {
      state.quizesData = quizzes;
    },
    selectQuiz(state, quiz) {
      state.selectedQuiz = quiz;
    },
    ViewAssignedQuiz(state, quiz) {
      state.assignedQuiz = quiz;
    },

    SET_PENDING_STUDENTS(state, students) {
      state.pendingStudents = students;
    },
    // ACCEPT_STUDENT(state, studentIndex) {
    //   // Move the student from pending to accepted
    //   const acceptedStudent = state.pendingStudents.splice(studentIndex, 1)[0];
    //   acceptedStudent.status = 'accepted';
    //   // Here, you might want to push the student to an acceptedStudents list if you have it
    // },
    // REJECT_STUDENT(state, studentIndex) {
    //   // Move the student from pending to rejected
    //   const rejectedStudent = state.pendingStudents.splice(studentIndex, 1)[0];
    //   rejectedStudent.status = 'rejected';
    //   rejectedStudent.rejectedAt = new Date().toLocaleDateString(); // Add rejection date
    //   // You can also add this to a rejectedStudents array in state
    // },
  },
  actions: {
    async addQuiz({ commit }, quizData) {
      try {
        const token = loadFromLocalStorage("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        console.log('Received formData:', quizData);

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/create-quiz`, quizData, config);

        const quizid = response.data.quiz.id;
        console.log('data ', quizid);
        return quizid;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return '';
      }
    },
    async addQuestion({ commit }, quizData) {
      try {
        console.log('Received formData:', quizData);
        const token = loadFromLocalStorage("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/create-questions`, quizData, config);

        console.log('data ', response.data);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async fetchPendingStudents({ commit }) {
      try {
        const token = loadFromLocalStorage("token");
        console.log(token)
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/admin/view-students`, config); // Replace with actual API
        console.log("P", response.data);
        commit('SET_PENDING_STUDENTS', response.data.data);

      } catch (error) {
        console.error('Error fetching pending students:', error);
      }
    },
    async acceptAndReject({ commit }, { id, action }) {

      try {
        const token = loadFromLocalStorage("token");
        console.log(action)
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        console.log('Cred ', id);
        const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/admin/submission/${id}/${action}`, {}, config
        ); // Simulated API call
        console.log(response.data);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },

    // Auth Actions
    async updatePassword({ commit }, password) {
      try {
        console.log('Cred ', password);
        const response = await axios.post('http://192.168.15.243:8000/api/password/forgot', {
          password
        }); // Simulated API call
        console.log('data ', response.data);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async login({ commit }, credentials) {
      try {
        console.log('Cred ', credentials);

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/login`, {
          email: credentials.email,
          password: credentials.password,
        });

        console.log('data ', response.data);

        const { access_token, token_type, expires_in } = response.data.token; // Assuming the token comes like this

        // Store token in Vuex and localStorage
        saveToLocalStorage('token', access_token);
        // Optionally store the token_type and expires_in if needed
        saveToLocalStorage('token_type', token_type); // If you need to store token type
        saveToLocalStorage('expires_in', expires_in); // If you need to handle token expiration
        // Assuming the role comes as response.data.data.name, but confirm this field
        saveToLocalStorage('role', response.data.data.role);
        saveToLocalStorage('id', response.data.data.studentId);
        console.log("id ", response.data.data.studentId)

        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async submitProfile({ commit }, formData) {
      try {
        console.log('Received formData:', formData);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('cv_file', formData.cv); // Assuming `formData.cv` is a file input

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/submission`, data);

        console.log('data ', response.data);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async addRole({ commit }, formData) {
      try {
        console.log('Received formData:', formData);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('role', formData.role);
        data.append('token', loadFromLocalStorage("token"));

        // Log FormData contents
        for (let [key, value] of data.entries()) {
          console.log(`${key}: ${value}`);
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/add-user`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Response data:', response.data);
        // You can also commit any necessary mutations here
        return response.data; // Return the response data for further handling
      } catch (error) {
        console.error('Error adding role:', error.response ? error.response.data : error.message);
        return false; // Return false to indicate failure
      }
    },

    async fetchQuizzes({ commit }) {
      try {
        const token = loadFromLocalStorage("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        // Fetch quizzes from your db.json (update URL with the correct path to your db.json file)
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/view-quizzes`, config);
        console.log("assigned ", response.data);
        commit('quizesData', response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    async assignQuizzes({ commit }, data) {
      try {
        const token = loadFromLocalStorage("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        // Fetch quizzes from your db.json (update URL with the correct path to your db.json file)
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/assign-quiz`, data, config);
        console.log("D ", response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    async fetchAssignedQuiz({ commit }) {
      try {
        const token = loadFromLocalStorage("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        // Fetch quizzes from your db.json (update URL with the correct path to your db.json file)
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/view-assigned-quizzes`, config);
        console.log("QDATA ", response.data);
        commit('ViewAssignedQuiz', response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },

    selectQuiz({ commit, state }, quizId) {
      const selectedQuiz = state.quizzes.find((quiz) => quiz.id === quizId);
      commit('selectQuiz', selectedQuiz);
    },
    clearToken({ commit }) {
      commit('CLEAR_TOKEN');
      return true;
    },
  },
  getters: {
    // Auth Getters
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    pendingStudents(state) {
      console.log("SSSS ", state.pendingStudents)
      return state.pendingStudents || [];
    },
    quizesData(state) {
      return state.quizesData;
    },
    getAssignedQuiz(state) {
      return state.assignedQuiz;
    }
  },
});
