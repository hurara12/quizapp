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

    <!-- Button to navigate to profile submission -->
    <div class="text-center mt-3">
      <button @click="navigateToProfile" class="btn btn-link">
        New User? Submit your profile
      </button>
    </div>

    <div v-if="alertMessage" :class="alertClass" class="mt-3">
      {{ alertMessage }}
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginForm',
  setup() {
    const email = ref('');
    const password = ref('');
    const alertMessage = ref('');
    const alertClass = ref('');

    const store = useStore();
    const router = useRouter();

    const handleLogin = async () => {
      const credentials = {
        email: email.value,
        password: password.value,
      };

      const success = await store.dispatch('login', credentials);

      if (success) {
        router.push('/dashboard'); // Navigate to the dashboard on success
      } else {
        displayAlert('User not Found', 'alert alert-danger');
      }
    };

    const displayAlert = (message, className) => {
      alertMessage.value = message;
      alertClass.value = className;
    };

    const navigateToProfile = () => {
      router.push('/submitprofile');
    };

    return {
      email,
      password,
      alertMessage,
      alertClass,
      handleLogin,
      navigateToProfile,
    };
  },
};
</script>
