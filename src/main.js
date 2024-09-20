import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';


library.add(fas);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(store);
app.use(router);
app.mount('#app');


// Frontend Team Tasks:
// Admin and Manager Dashboards:
// Design an Admin dashboard where Admins can:
// Add Managers and assign roles.
//  View / accept / reject student requests.
// Assign quizzes to students.
// View all quizzes, quiz results, and student details.
// Filter students based on their acceptance or rejection status.
// Design a Manager dashboard where Managers can:
// Assign quizzes to students.
// View student details and quizzes.
// Filter students based on their acceptance or rejection status.
// JWT Authentication UI:
// Develop login page for Admin, Manager, and Student.
// Integrate JWT - based authentication for login, including token management(login, logout).
// Redirect users to their respective dashboard screen based on their roles after login.
// Student Dashboard:
// Create a form for students to submit their personal details and upload their CV[public route].
// Create a Student dashboard showing:
// Assigned quizzes.
// Pending quizzes.
// Attempted quizzes
// Quiz results.
// Allow quiz access only on the defined date.
// Enable mic and camera for video recording during quiz attempts.
// Display the result at the end of a quiz attempt.
// UI for Email Links:
// Design pages for setting up passwords from email links(valid for 24 hours).
// Create UI to display an error message if the link has expired, allowing Admin to resend.

