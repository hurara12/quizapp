<template>
  <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
    <h2 class="text-center mb-4">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password"
          required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      console.log('Email:', this.email);
      console.log('Password:', this.password);
      // Backend integration logic goes here
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
