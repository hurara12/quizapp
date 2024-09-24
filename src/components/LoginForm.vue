<template>
  <div class="main-wrap">
    <div id="logindiv" class="container-fluid d-flex mt-5 justify-content-center">
      <div class="form-container mt-5 justify-content-center p-5 shadow">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent="handleLogin" class="login-form form-container needs-validation">
          <div v-if="alertMessage" :class="alertClass" role="alert">{{ alertMessage }}</div>

          <div class="input-box email input-group my-3 me-5">
            <span class="input-group-text">
              <font-awesome-icon icon="envelope" style="color: #63E6BE;"></font-awesome-icon>
            </span>
            <div class="form-floating">
              <input type="email" v-model="email" class="input-field form-control" placeholder="Enter Email" required
                id="email" />
              <label for="email">Email</label>
            </div>
          </div>

          <div class="input-box password input-group my-3 me-5">
            <span class="input-group-text">
              <font-awesome-icon icon="lock" style="color: #63E6BE;"></font-awesome-icon>
            </span>
            <div class="form-floating">
              <input type="password" v-model="password" class="input-field form-control" placeholder="Enter Password"
                required id="password" />
              <label for="password">Password</label>
            </div>
          </div>

          <div class="submitbtn my-3">
            <button type="submit" class="submit btn btn-success w-100 py-2">Sign In</button>
          </div>

          <!-- Button to navigate to profile submission -->
          <div class="text-center mt-3">
            <button @click="navigateToProfile" class="btn btn-link">
              New User? Submit your profile
            </button>
          </div>
        </form>
      </div>
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
        displayAlert('Successfully Logged in', 'alert alert-success');
        setTimeout(() => {
          router.push('/dashboard'); // Navigate to the dashboard after 1.5 seconds
        }, 1500);
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

<style scoped>
.main-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
