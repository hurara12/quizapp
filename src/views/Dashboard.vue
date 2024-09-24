<template>
  <div class="container mt-5">
    <h1 class="text-center">Dashboard</h1>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="(button, index) in buttons" :key="index">
        <div class="card text-center h-100">
          <div class="card-body">
            <h5 class="card-title">{{ button.title }}</h5>
            <p class="card-text">{{ button.description }}</p>
            <router-link :to="button.link" class="btn btn-primary">Go</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  data() {
    return {
      buttons: [
        { title: "Manager Roles", description: "View and Edit Manager requests.", link: "/managerroles" },
        { title: "Manage Students", description: "Manage Student and assign Quiz", link: "/managestudents" },
        { title: "View Results", description: "Check quiz results.", link: "/view-results" },
        { title: "Student Requests", description: "Approve or reject student requests.", link: "/student-requests" },
        { title: "Profile Management", description: "Manage your profile.", link: "/profile" },
        { title: "Settings", description: "Adjust your settings.", link: "/settings" },
        { title: "Quiz", description: "View and Edit Manager requests.", link: "/quizcomponent" },
      ],
    };
  },
};
</script>

<style scoped>
.card {
  transition: transform 0.3s;
}

.card:hover {
  transform: scale(1.05);
}
</style>
