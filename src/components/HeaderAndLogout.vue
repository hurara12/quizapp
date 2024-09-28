<template>
    <div class="dashboard-header fixed-top w-100">
        <div class="header-container d-flex align-items-top justify-content-between p-4 shadow">
            <!-- Centered Dashboard Title -->
            <div class="d-flex justify-content-center flex-grow-1">
                <h1 class="text-white">{{ title }}</h1>
            </div>

            <!-- Logout Button aligned to the right -->
            <div class="d-flex justify-content-end ms-auto">
                <transition name="fade">
                    <button @click="logout" class="btn logout-btn" v-if="!isLoggingOut">
                        <font-awesome-icon icon="right-from-bracket" class="fa-2xl"
                            style="color: whitesmoke;"></font-awesome-icon>
                    </button>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
    name: "DashboardHeader",
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    setup() {
        const isLoggingOut = ref(false);

        const router = useRouter();
        const store = useStore();

        const logout = () => {
            isLoggingOut.value = true;
            setTimeout(() => {
                store.dispatch('clearToken');
                router.push('/login');
            }, 300); // Match this duration with the fade-out animation duration
        };

        return {
            isLoggingOut,
            logout,
        };
    },
};
</script>

<style scoped>
.dashboard-header {
    background-color: #244855;
    z-index: 1000;
}

.header-container {
    background: linear-gradient(180deg, #244855, #244855 50%, #254a5b);
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h1 {
    font-size: 2.5rem;
    color: whitesmoke;
    margin: 0;
}

/* Logout button styling */
.logout-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.logout-btn:hover {
    opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
    h1 {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.75rem;
    }
}
</style>
