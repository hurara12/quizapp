<template>
    <div class="main-wrap d-flex justify-content-center align-items-center min-vh-100">
        <div class="container-fluid d-flex mt-5 justify-content-center">
            <div class="form-container mt-5 justify-content-center p-5 shadow">
                <h2 class="text-center mb-2">Submit Your Profile</h2>
                <form @submit.prevent="handleSubmitProfile" class=" needs-validation">
                    <div v-if="alertMessage" :class="alertClass" role="alert">{{ alertMessage }}</div>

                    <!-- First Name Input -->
                    <div class="input-box input-group my-3 me-5">
                        <span class="input-group-text">
                            <font-awesome-icon icon="user" class="fa-lg" style="color: #63E6BE;"></font-awesome-icon>
                            <!-- <i class="fa-solid fa-user fa-lg" style="color: #63E6BE;"></i> -->
                        </span>
                        <div class="form-floating">
                            <input v-model="name" type="text" class="input-field form-control" id="name"
                                placeholder="Enter Name" required />
                            <label for="name">Name</label>
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
                    <!-- CV Upload -->

                    <div class="mb-3">
                        <label for="cv" class="form-label">Upload CV:</label>
                        <input type="file" class="form-control" id="cv" @change="handleFileUpload" required />
                    </div>

                    <!-- Submit Button -->
                    <div class="submitbtn my-3">
                        <button type="submit" :disabled="loadingComp" class="submit btn btn-success w-100 py-2">Submit
                            Profile
                            <!-- <i class="fa fa-circle-o-notch fa-spin"></i> -->
                            <font-awesome-icon v-if="loadingComp" :icon="['fas', 'circle-notch']" class="fa-lg fa-spin"
                                style="color: white;">
                            </font-awesome-icon>
                        </button>
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
        const name = ref('');
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const phone = ref('');
        const cv = ref(null);
        const alertMessage = ref('');
        const alertClass = ref('');
        let loadingComp = ref(false);

        const router = useRouter();
        const store = useStore();

        const handleSubmitProfile = async () => {
            const credentials = {
                name: name.value,  // Ensure correct concatenation
                email: email.value,
                cv: cv.value,
            };
            console.log(credentials)
            loadingComp.value = true;
            //console.log(formData.name.values)

            try {
                const success = await store.dispatch('submitProfile', credentials);

                if (success) {
                    displayAlert('Profile submitted successfully!', 'alert alert-success');
                    loadingComp.value = false;
                    setTimeout(() => {
                        router.push('/login');
                    }, 1500);
                }
                else {
                    displayAlert('Failed to submit profile. Please try again.', 'alert alert-danger');
                    loadingComp.value = false;
                }
            } catch (error) {
                loadingComp.value = false;
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
            name,
            email,
            cv,
            alertMessage,
            alertClass,
            handleSubmitProfile,
            handleFileUpload,
            navigateToLogin,
            loadingComp,
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
