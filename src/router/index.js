import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SubmitProfile from '@/views/SubmitProfile.vue';
import Dashboard from '@/views/Dashboard.vue';
import QuizComponent from '@/components/QuizComponent.vue';
import ManagerRoles from '@/components/ManagerRoles.vue';
import ManageStudents from '@/components/ManageStudents.vue';
import ViewResult from '@/components/ViewResult.vue';
import ViewSoloResult from '@/components/ViewSoloResult.vue';
import ViewandSelectQuiz from '@/components/ViewandSelectQuiz.vue';
import CreateQuiz from '@/components/CreateQuiz.vue';
import UpdatePassword from '@/components/UpdatePassword.vue';

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
  },
  {
    path: '/viewresult',  // Define the route for profile submission
    name: 'ViewResult',
    component: ViewResult,
  },
  {
    path: '/viewsoloresult',  // Define the route for profile submission
    name: 'ViewSoloResult',
    component: ViewSoloResult,
  },
  {
    path: '/viewandselectquiz',  // Define the route for profile submission
    name: 'ViewandSelectQuiz',
    component: ViewandSelectQuiz,
  },
  {
    path: '/createquiz',  // Define the route for profile submission
    name: 'CreateQuiz',
    component: CreateQuiz,
  },
  {
    path: '/updatepassword',  // Define the route for profile submission
    name: 'UpdatePassword',
    component: UpdatePassword,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
