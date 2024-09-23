<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card shadow-sm p-4" style="max-width: 500px; width: 100%;">
            <h2 class="text-center mb-4">Submit Your Profile</h2>
            <form @submit.prevent="handleSubmitProfile">
                <div class="mb-3">
                    <label for="firstname" class="form-label">First Name:</label>
                    <input v-model="firstname" type="text" class="form-control" id="firstname"
                        placeholder="Enter your first name" required />
                </div>

                <div class="mb-3">
                    <label for="lastname" class="form-label">Last Name:</label>
                    <input v-model="lastname" type="text" class="form-control" id="lastname"
                        placeholder="Enter your last name" required />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email"
                        required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password:</label>
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control"
                        id="password" placeholder="Enter your password" required />
                    <div class="form-check mt-2">
                        <input v-model="showPassword" type="checkbox" class="form-check-input" id="showPassword" />
                        <label class="form-check-label" for="showPassword">Show Password</label>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number:</label>
                    <input v-model="phone" type="tel" class="form-control" id="phone"
                        placeholder="Enter your phone number" required />
                </div>

                <div class="mb-3">
                    <label for="cv" class="form-label">Upload CV:</label>
                    <input type="file" class="form-control" id="cv" @change="handleFileUpload" required />
                </div>

                <button type="submit" class="btn btn-primary w-100">Submit Profile</button>
            </form>

            <!-- Button to go back to the login screen -->
            <div class="text-center mt-3">
                <button @click="navigateToLogin" class="btn btn-link">
                    Want to Login?
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'SubmitProfile',
    setup() {
        const firstname = ref('');
        const lastname = ref('');
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const phone = ref('');
        const cv = ref(null);

        const router = useRouter();

        const handleSubmitProfile = async () => {
            const formData = new FormData();
            formData.append('firstname', firstname.value);
            formData.append('lastname', lastname.value);
            formData.append('email', email.value);
            formData.append('password', password.value);
            formData.append('phone', phone.value);
            formData.append('cv', cv.value); // Assuming the CV is a file

            try {
                // Dispatch the Vuex action to submit the profile
                const success = await store.dispatch('submitProfile', formData);

                // Handle success
                if (success) {
                    alert('Profile submitted successfully!');
                    router.push('/login'); // Redirect to login page
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
                alert('Failed to submit profile. Please try again.');
            }
        };


        const handleFileUpload = (event) => {
            cv.value = event.target.files[0]; // Capture the uploaded CV file
        };

        const navigateToLogin = () => {
            router.push('/login'); // Redirect to the login page
        };

        return {
            firstname,
            lastname,
            email,
            password,
            showPassword,
            phone,
            cv,
            handleSubmitProfile,
            handleFileUpload,
            navigateToLogin,
        };
    },
};
</script>

<style scoped>
.container {
    background-color: #f0f2f5;
}

.card {
    border-radius: 10px;
}
</style>
