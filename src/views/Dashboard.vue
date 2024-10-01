<template>
  <div class="main-wrap">
    <div class="container mt-5">
      <Header title="Dashboard" />

      <div class="row mt-4">
        <div class="col-lg-4 col-md-6 col-12 mb-4" v-for="(button, index) in buttons" :key="index">
          <div class="card text-center h-100" @click="handleCardClick(index)">
            <div class="card-body">
              <h5 class="card-title">{{ button.title }}</h5>
              <p class="card-text">{{ button.description }}</p>
              <router-link :to="button.link" class="btn btn-outline-warning">Open</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Header from '@/components/HeaderAndLogout.vue'; // 

export default {
  name: "DashboardView",
  components: {
    Header,
  },

  setup() {
    const buttons = ref([
      { title: "Manager Roles", description: "View and Edit Manager requests.", link: "/managerroles" },
      { title: "Manage Students", description: "Manage Student and assign Quiz", link: "/managestudents" },
      { title: "View Results", description: "Check quiz results.", link: "/viewresult" },
      { title: "Quiz", description: "Create and Manage Quiz", link: "/createquiz" },
      { title: "Update Profile", description: "Update your Password", link: "/updatepassword" },
      { title: "Attempt Quiz", description: "View and attempt Quizes", link: "/viewandselectquiz" },
    ]);

    const router = useRouter();
    const store = useStore();
    const isLoggingOut = ref(false);

    // onMounted(() => {
    //   route.meta.handleBackNavigation = handleBackNavigation; // Assign it to meta for later access
    // });

    const handleCardClick = (index) => {
      console.log(`Card ${index + 1} clicked`); // Placeholder for handling card clicks
    };

    return {
      buttons,
      isLoggingOut,
      handleCardClick
    };

  }
};
</script>

<style scoped>
.main-wrap {
  background-color: #fbe9d0;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #77b1ad;
  box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card:active {
  transform: scale(0.95);
}
</style>
