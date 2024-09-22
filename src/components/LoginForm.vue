<template>
  <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
    <h2 class="text-center mb-4">Login</h2>
    <div v-if="alertMessage" :class="alertClass" role="alert">{{ alertMessage }}</div>
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
import { useStore } from 'vuex';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginForm',
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const alertMessage = ref('');
    const alertClass = ref('');

    const handleLogin = async () => {
      const credentials = {
        email: email.value,
        password: password.value,
      };

      // Call Vuex action for login
      const success = await store.dispatch('login', credentials);

      if (success) {
        router.push('/dashboard'); // Redirect to dashboard on success
      } else {
        displayAlert('User not Found', 'alert alert-danger');
      }
    };

    const displayAlert = (message, className) => {
      alertMessage.value = message;
      alertClass.value = className;
    };

    return {
      email,
      password,
      alertMessage,
      alertClass,
      handleLogin,
    };
  },
};
</script>