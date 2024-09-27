import { createStore } from 'vuex';
import axios from 'axios';

function loadFromLocalStorage(dataToGet) {
  const data = localStorage.getItem(dataToGet) || [];
  return data;
}

function saveToLocalStorage(keyToSave, dataToSave) {
  localStorage.setItem(keyToSave, JSON.stringify(dataToSave));
}
function deleteFromLocalStorage(dataToRemove) {
  localStorage.removeItem(dataToRemove);
}

export default createStore({
  state: {
    token: null,
    user: null,
    quizzes: [], // Stores all quiz categories
    selectedQuiz: null, // Stores the currently selected quiz
    pendingStudents: [], // Holds the fetched pending students data
  },
  mutations: {
    // Auth Mutations
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      deleteFromLocalStorage('token');
      deleteFromLocalStorage('role');
    },
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes;
    },
    selectQuiz(state, quiz) {
      state.selectedQuiz = quiz;
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
    REJECT_STUDENT(state, studentIndex) {
      // Move the student from pending to rejected
      const rejectedStudent = state.pendingStudents.splice(studentIndex, 1)[0];
      rejectedStudent.status = 'rejected';
      rejectedStudent.rejectedAt = new Date().toLocaleDateString(); // Add rejection date
      // You can also add this to a rejectedStudents array in state
    },
    // Student and Quiz Mutations
    //   SET_ACCEPTED_STUDENTS(state, students) {
    //     state.acceptedStudents = students;
    //   },
    //   SET_PENDING_STUDENTS(state, students) {
    //     state.pendingStudents = students;
    //   },
    //   SET_AVAILABLE_QUIZZES(state, quizzes) {
    //     state.availableQuizzes = quizzes;
    //   },
    //   SET_QUIZ_ASSIGNMENTS(state, assignments) {
    //     state.quizAssignments = assignments;
    //   },
    //   ASSIGN_QUIZ_TO_STUDENT(state, { studentEmail, quiz }) {
    //     const assignment = state.quizAssignments.find(a => a.quizId === quiz.id);
    //     if (!assignment) {
    //       // If there's no assignment for this quiz, create one
    //       state.quizAssignments.push({
    //         quizId: quiz.id,
    //         quizTitle: quiz.title,
    //         assignments: [{ studentEmail, assignedAt: new Date().toISOString() }],
    //       });
    //     } else {
    //       const studentAssigned = assignment.assignments.some(a => a.studentEmail === studentEmail);
    //       if (!studentAssigned) {
    //         assignment.assignments.push({ studentEmail, assignedAt: new Date().toISOString() });
    //       }
    //     }
    //   },
    //   UNASSIGN_QUIZ(state, { studentEmail, quizId }) {
    //     const assignment = state.quizAssignments.find(a => a.quizId === quizId);
    //     if (assignment) {
    //       assignment.assignments = assignment.assignments.filter(a => a.studentEmail !== studentEmail);
    //     }
    //   },
  },
  actions: {

    async fetchPendingStudents({ commit }) {
      try {
        const response = await axios.get('http://192.168.15.243:8000/api/admin/pending-students'); // Replace with actual API
        commit('SET_PENDING_STUDENTS', response.data);
        console.log("P", response.data);
      } catch (error) {
        console.error('Error fetching pending students:', error);
      }
    },
    async acceptStudent({ commit }, id) {

      try {
        console.log('Cred ', id);
        const response = await axios.post('http://192.168.15.243:8000/api/admin/approve', {
          id
        }); // Simulated API call
        console.log(response.data);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async rejectStudent({ commit }, id) {
      try {
        console.log('Cred ', id);
        const response = await axios.post('http://192.168.15.243:8000/api/admin/reject', {
          id
        }); // Simulated API call
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
        const response = await axios.post('http://192.168.15.243:8000/api/login', {
          email: credentials.email,
          password: credentials.password,
        }); // Simulated API call
        console.log('data ', response.data);
        const { access_token, token_type, expires_in } = response.data;
        console.log('data ', response.data);
        commit('SET_TOKEN', access_token);
        localStorage.setItem('token', access_token);
        localStorage.setItem('role', response.data.user.roles);
        return true;
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
    },
    async submitProfile({ commit }, formData) {
      try {// test it that axious should take direct formdata
        console.log('Received formData:', formData);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('cv', formData.cv); // Assuming `formData.cv` is a file input
        const response = await axios.post('http://192.168.15.243:8000/api/register-student', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
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

        const response = await axios.post('http://192.168.15.76:8000/api/admin/add-user', data, {
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
        // Fetch quizzes from your db.json (update URL with the correct path to your db.json file)
        const response = await axios.get('http://localhost:3000/quizzes');
        commit('setQuizzes', response.data);
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

    // Fetch Students Based on Status (Pending/Accepted)
    // async fetchStudents({ commit }) {
    //   try {
    //     const response = await axios.get('http://localhost:3000/studentRequests');  // Simulated API call
    //     const studentRequests = response.data.studentRequests;

    //     const acceptedStudents = studentRequests.filter(student => student.status === 'accepted');
    //     const pendingStudents = studentRequests.filter(student => student.status === 'pending');

    //     commit('SET_ACCEPTED_STUDENTS', acceptedStudents);
    //     commit('SET_PENDING_STUDENTS', pendingStudents);
    //   } catch (error) {
    //     console.error('Error fetching students:', error);
    //   }
    // },

    // // Fetch Available Quizzes
    // async fetchQuizzes({ commit }) {
    //   try {
    //     const response = await axios.get('/http://localhost:3000/quizzes');  // Simulated API call
    //     commit('SET_AVAILABLE_QUIZZES', response.data.quizzes);
    //   } catch (error) {
    //     console.error('Error fetching quizzes:', error);
    //   }
    // },

    // // Fetch Quiz Assignments
    // async fetchQuizAssignments({ commit }) {
    //   try {
    //     const response = await axios.get('http://localhost:3000/quizAssignments');  // Simulated API call
    //     commit('SET_QUIZ_ASSIGNMENTS', response.data.quizAssignments);
    //   } catch (error) {
    //     console.error('Error fetching quiz assignments:', error);
    //   }
    // },

    // Assign Quiz to Selected Students
    // async assignQuiz({ commit, state }, { selectedStudents, quiz }) {
    //   try {
    //     selectedStudents.forEach(student => {
    //       // Check if the quiz is already assigned to the student
    //       const isAlreadyAssigned = state.quizAssignments.some(assignment =>
    //         assignment.quizId === quiz.id && assignment.assignments.some(a => a.studentEmail === student.email)
    //       );

    //       if (!isAlreadyAssigned) {
    //         commit('ASSIGN_QUIZ_TO_STUDENT', { studentEmail: student.email, quiz });
    //       }
    //     });

    //     // Simulate saving the quiz assignment to the backend
    //     await axios.post('/save-quiz-assignments', { quizId: quiz.id, selectedStudents });

    //     return true;
    //   } catch (error) {
    //     console.error('Error assigning quiz:', error);
    //     return false;
    //   }
    // },

    // // Accept and Reject Student Actions
    // acceptStudent({ commit, state }, index) {
    //   const student = state.pendingStudents[index];
    //   commit('SET_ACCEPTED_STUDENTS', [...state.acceptedStudents, student]);
    //   commit('SET_PENDING_STUDENTS', state.pendingStudents.filter((_, i) => i !== index));
    // },

    // rejectStudent({ commit, state }, index) {
    //   commit('SET_PENDING_STUDENTS', state.pendingStudents.filter((_, i) => i !== index));
    // },
  },
  getters: {
    // Auth Getters
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    pendingStudents(state) {
      return state.pendingStudents;
    },
    // Student and Quiz Getters
    // getAcceptedStudents: (state) => state.acceptedStudents,
    // getPendingStudents: (state) => state.pendingStudents,
    // getAvailableQuizzes: (state) => state.availableQuizzes,

    // // Fetch Assigned Quizzes for a Student
    // getAssignedQuizzesForStudent: (state) => (studentEmail) => {
    //   return state.quizAssignments
    //     .filter(assignment => assignment.assignments.some(a => a.studentEmail === studentEmail))
    //     .map(assignment => assignment.quizTitle);
    // },
  },
});
