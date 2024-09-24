import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: null,
    user: null,
    // acceptedStudents: [],
    // pendingStudents: [],
    // availableQuizzes: [],
    // quizAssignments: [],
  },
  mutations: {
    // Auth Mutations
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
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
    // Auth Actions
    async login({ commit }, credentials) {
      try {
        console.log("Cred ", credentials)
        const response = await axios.post('http://192.168.15.35:8000/api/login', {
          email: credentials.email,
          password: credentials.password
        });  // Simulated API call
        console.log("data ", response.data);
        return true;
        // const users = response.data;
        // const user = users.find(user =>
        //   user.email === credentials.email && user.password === credentials.password
        // );

        // if (user) {
        //   const token = 'dummy_token_' + user.id;
        //   commit('SET_TOKEN', token);
        //   commit('SET_USER', user);
        //   localStorage.setItem('token', token);
        //   return true;
        // } else {
        //   return false;
        // }
      } catch (error) {
        console.error('Error', error.response ? error.response.data : error);
        return false;
      }
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
