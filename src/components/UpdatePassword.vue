<template>
    <div class="main-wrap">
        <div class="container mt-5">
            <Header title="Update Your Profile" />
            <div class="row justify-content-center ">
                <div class="col-12 col-md-8 col-lg-6 profile-section">
                    <h3 class="text-center text-muted mb-4">Set Password</h3>
                    <form @submit.prevent="updatePassword">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control" id="newPassword" v-model="newPassword"
                                        placeholder="New Password" required />
                                    <label for="newPassword">New Password</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control" id="confirmNewPassword"
                                        v-model="confirmNewPassword" placeholder="Confirm New Password" required />
                                    <label for="confirmNewPassword">Confirm New Password</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                                    {{ errorMessage }}
                                </div>
                                <div v-if="successMessage" class="alert alert-success" role="alert">
                                    {{ successMessage }}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <button class="btn w-100" type="submit">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import Header from '@/components/HeaderAndLogout.vue'; // 

const router = useRouter();
const newPassword = ref('');
const confirmNewPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');


const updatePassword = async () => {
    try {
        errorMessage.value = '';
        successMessage.value = '';
        if (newPassword.value !== confirmNewPassword.value) {
            errorMessage.value = 'Passwords do not match';
            return;
        }
        const success = await store.dispatch('updatePassword', newPassword.value);
        if (success) {

            
            successMessage.value = 'Password updated successfully!';
            newPassword.value = '';
            confirmNewPassword.value = '';
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }
        else {
        }

    } catch (error) {
        console.error('Error submitting profile:', error);
        errorMessage.value = 'Failed to Update Password';
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

.profile-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
}

h3 {
    font-size: 1.8rem;
}

.form-floating {
    position: relative;
    margin-bottom: 1.5rem;
}

button {
    background-color: #77b1ad;
    padding: 0.75rem;
    font-size: 1rem;
}

button:hover {
    background-color: #8fcbc7;
}

.alert {
    margin-top: 1rem;
}
</style>
