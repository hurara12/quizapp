import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SubmitProfile from '@/views/SubmitProfile.vue';
import Dashboard from '@/views/Dashboard.vue';
import QuizComponent from '@/components/QuizComponent.vue';
import ManagerRoles from '@/components/ManagerRoles.vue';
import ManageStudents from '@/components/ManageStudents.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/submitprofile',  // Define the route for profile submission
    name: 'SubmitProfile',
    component: SubmitProfile,
  },
  {
    path: '/dashboard',  // Define the route for profile submission
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/quizcomponent',  // Define the route for profile submission
    name: 'QuizComponent',
    component: QuizComponent,
  },
  {
    path: '/managerroles',  // Define the route for profile submission
    name: 'ManagerRoles',
    component: ManagerRoles,
  },
  {
    path: '/managestudents',  // Define the route for profile submission
    name: 'ManageStudents',
    component: ManageStudents,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
