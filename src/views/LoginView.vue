<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue';

export default {
  name: 'LoginView',
  components: {
    LoginForm,
  },
};
</script>

<style scoped>
.container {
  background-color: #f0f2f5;
}
</style>
