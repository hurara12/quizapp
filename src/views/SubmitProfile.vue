<template>
    <div class="main-wrap">
        <div class="container-fluid d-flex justify-content-center">
            <div class="form-container justify-content-center p-5 shadow">
                <h2 class="text-center mb-2">Submit Your Profile</h2>
                <form @submit.prevent="handleSubmitProfile" class="login-form form-container needs-validation">
                    <div v-if="alertMessage" :class="alertClass" role="alert">{{ alertMessage }}</div>

                    <!-- First Name Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="user" class="fa-lg" style="color: #63E6BE;"></font-awesome-icon>
                            <!-- <i class="fa-solid fa-user fa-lg" style="color: #63E6BE;"></i> -->
                        </span>
                        <div class="form-floating">
                            <input v-model="firstname" type="text" class="input-field form-control" id="firstname"
                                placeholder="Enter First Name" required />
                            <label for="firstname">First Name</label>
                        </div>
                    </div>

                    <!-- Last Name Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="user" class="fa-lg" style="color: #63E6BE;"></font-awesome-icon>
                        </span>
                        <div class="form-floating">
                            <input v-model="lastname" type="text" class="input-field form-control" id="lastname"
                                placeholder="Enter Last Name" required />
                            <label for="lastname">Last Name</label>
                        </div>
                    </div>

                    <!-- Email Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="envelope" class="fa-lg"
                                style="color: #63E6BE;"></font-awesome-icon>
                            <!-- <i class="fa-regular fa-envelope fa-lg" style="color: #63E6BE;"></i> -->
                        </span>
                        <div class="form-floating">
                            <input v-model="email" type="email" class="input-field form-control"
                                placeholder="Enter Email" required />
                            <label for="email">Email</label>
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="lock" class="fa-lg" style="color: #63E6BE;"></font-awesome-icon>
                        </span>
                        <div class="form-floating">
                            <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                class="input-field form-control" placeholder="Enter Password" required />
                            <label for="password">Password</label>
                        </div>
                    </div>
                    <div class="form-check mt-2">
                        <input v-model="showPassword" type="checkbox" class="form-check-input" id="showPassword" />
                        <label class="form-check-label" for="showPassword">Show Password</label>
                    </div>

                    <!-- Phone Number Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="phone" class="fa-lg" style="color: #63E6BE;"></font-awesome-icon>
                        </span>
                        <div class="form-floating">
                            <input v-model="phone" type="tel" class="input-field form-control" id="phone"
                                placeholder="Enter Phone Number" required />
                            <label for="phone">Phone Number</label>
                        </div>
                    </div>
                    <!-- CV Upload -->

                    <div class="mb-3">
                        <label for="cv" class="form-label">Upload CV:</label>
                        <input type="file" class="form-control" id="cv" @change="handleFileUpload" required />
                    </div>

                    <!-- Submit Button -->
                    <div class="submitbtn my-3">
                        <button type="submit" class="submit btn btn-success w-100 py-2">Submit Profile</button>
                    </div>
                </form>

                <!-- Login Button -->
                <div class="text-center mt-3">
                    <button @click="navigateToLogin" class="btn btn-link">Want to Login?</button>
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
    name: 'SubmitProfile',
    setup() {
        const firstname = ref('');
        const lastname = ref('');
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const phone = ref('');
        const cv = ref(null);
        const alertMessage = ref('');
        const alertClass = ref('');

        const router = useRouter();
        const store = useStore();

        const handleSubmitProfile = async () => {
            const credentials = {
                name: `${firstname.value} ${lastname.value}`,  // Ensure correct concatenation
                email: email.value,
                cv: cv.value,
            };
            console.log(credentials)
            //console.log(formData.name.values)

            try {
                const success = await store.dispatch('submitProfile', credentials);

                if (success) {
                    displayAlert('Profile submitted successfully!', 'alert alert-success');
                    setTimeout(() => {
                        router.push('/login');
                    }, 1500);
                }
                else {
                    displayAlert('Failed to submit profile. Please try again.', 'alert alert-danger');
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
                displayAlert('Failed to submit profile. Please try again.', 'alert alert-danger');
            }
        };

        const handleFileUpload = (event) => {
            cv.value = event.target.files[0];
        };

        const displayAlert = (message, className) => {
            alertMessage.value = message;
            alertClass.value = className;
        };

        const navigateToLogin = () => {
            router.push('/login');
        };

        return {
            firstname,
            lastname,
            email,
            password,
            showPassword,
            phone,
            cv,
            alertMessage,
            alertClass,
            handleSubmitProfile,
            handleFileUpload,
            navigateToLogin,
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

.form-container {
    max-width: 500px;
    width: 100%;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-box .input-group-text {
    background-color: #f0f2f5;
}

.submitbtn .submit {
    background-color: #28a745;
    border: none;
}

.submitbtn .submit:hover {
    background-color: #218838;
}
</style>
