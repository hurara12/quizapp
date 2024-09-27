<template>
  <div class="main-wrap">
    <div class="container mt-5">
      <div class="d-flex align-items-center justify-content-between p-4">
        <!-- Centered Dashboard Title -->
        <div class="d-flex justify-content-center flex-grow-1">
          <h1 class="mx-4 my-2">Dashboard</h1>
        </div>

        <!-- Logout Button aligned to the right -->
        <div class="d-flex justify-content-end ms-auto">
          <transition name="fade">
            <button @click="logout" class="px-4 btn logout-btn" v-if="!isLoggingOut">
              <font-awesome-icon icon="right-from-bracket" class="fa-2xl" style="color: #233453;"></font-awesome-icon>
            </button>
          </transition>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-4 mb-4" v-for="(button, index) in buttons" :key="index">
          <transition name="fade">
            <div class="card text-center h-100" @click="handleCardClick(index)">
              <div class="card-body">
                <h5 class="card-title">{{ button.title }}</h5>
                <p class="card-text">{{ button.description }}</p>
                <router-link :to="button.link" class="btn btn-outline-warning">Open</router-link>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: "DashboardView",
  setup() {
    const buttons = ref([
      { title: "Manager Roles", description: "View and Edit Manager requests.", link: "/managerroles" },
      { title: "Manage Students", description: "Manage Student and assign Quiz", link: "/managestudents" },
      { title: "View Results", description: "Check quiz results.", link: "/viewresult" },
      { title: "Quiz", description: "Create and Manage Quiz", link: "/createquiz" },
      { title: "Update Profile", description: "Update your Password", link: "/updatepassword" },
      { title: "Attempt Quiz", description: "View and attempt Quizes", link: "/quizcomponent" },
      { title: "Quiz temp", description: "AA", link: "/viewandselectquiz" },
    ]);

    const router = useRouter();
    const store = useStore();
    const isLoggingOut = ref(false);

    const logout = () => {
      isLoggingOut.value = true;
      setTimeout(() => {
        store.dispatch('clearToken');
        router.push('/login');
      }, 300); // Match this duration with the fade-out animation duration
    };

    const handleCardClick = (index) => {
      console.log(`Card ${index + 1} clicked`); // Placeholder for handling card clicks
    };

    return {
      buttons,
      logout,
      isLoggingOut,
      handleCardClick
    };
  }
};
</script>

<style scoped>
.main-wrap {
  background-color: rgba(255, 255, 255, 1);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card:active {
  transform: scale(0.95);
}

.logout-btn {
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 165, 0, 0.8);
  /* Change this color as needed */
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
