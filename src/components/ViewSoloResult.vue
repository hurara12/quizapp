<template>
    <div class="zoom-animation" :class="{ 'zoom-out': isZoomOut }">
        <div>
            <div class="container custom-container">
                <!-- <button @click="closeScreen" class="close-btn btn btn-primary">
                    x
                </button> -->
                <div class="row">
                    <!-- Profile Card -->
                    <div class="col-12 col-md-4">
                        <div class="card profile-card custom-height">
                            <div class="card-body text-center">
                                <img :src="userData.image" alt="Admin" class="rounded-circle p-1 bg-primary"
                                    width="110" />
                                <div class="mt-3">
                                    <h4 class="fade-in-text">{{ userData.firstName + " " + userData.lastName }}</h4>
                                    <p class="text-secondary">{{ userData.company.title }}</p>
                                    <p class="text-muted">{{ userData.email }}</p>
                                    <p class="text-muted">{{ userData.phone }}</p>
                                    <p class="text-muted">{{ userData.university }}</p>
                                </div>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="(value, label) in profileFields" :key="label">
                                    <strong>{{ label }}:</strong> {{ value }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- Editable Profile Form -->
                    <div class="col-12 col-md-8">
                        <div class="card custom-height">
                            <div class="card-body">
                                <h5>Profile Information</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item" v-for="(value, label) in profileInformation"
                                        :key="label">
                                        <strong>{{ label }}:</strong> {{ value }}
                                    </li>
                                </ul>
                                <h5>Company Information</h5>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item" v-for="(value, label) in companyDetails" :key="label">
                                        <strong>{{ label }}:</strong> {{ value }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();
        const userData = ref({
            firstName: "John",
            lastName: "Doe",
            image: "https://via.placeholder.com/150",
            role: "Admin",
            age: 30,
            gender: "Male",
            birthDate: "1990-01-01",
            bloodGroup: "O+",
            email: "johndoe@example.com",
            phone: "+123456789",
            university: "Tech University",
            username: "john_doe",
            password: "password123",
            company: {
                name: "Tech Corp",
                department: "Engineering",
                title: "Lead Engineer",
                address: {
                    address: "123 Main St",
                    city: "Metropolis",
                    stateCode: "MT",
                    postalCode: "12345",
                    country: "USA"
                }
            }
        });
        const isZoomOut = ref(false);

        const profileFields = computed(() => ({
            Role: userData.value.role,
            Age: userData.value.age,
            Gender: userData.value.gender,
            "Birth Date": userData.value.birthDate,
            "Blood Group": userData.value.bloodGroup,
        }));

        const profileInformation = computed(() => {
            const { address, city, stateCode, postalCode, country } = userData.value.company.address || {};
            return {
                "User Name": userData.value.username,
                Password: userData.value.password,
                Address: `${address || ""}, ${city || ""}, ${stateCode || ""} ${postalCode || ""} ${country || ""}`,
            };
        });

        const companyDetails = computed(() => {
            const { name, department, title, address } = userData.value.company || {};
            return {
                "Company Name": name,
                Department: department,
                Title: title,
                Address: `${address?.address || ""}, ${address?.city || ""}, ${address?.stateCode || ""} ${address?.postalCode || ""} ${address?.country || ""}`,
            };
        });


        const closeScreen = () => {
            isZoomOut.value = true;
            setTimeout(() => {
                router.replace("/viewresult");
            }, 1000);
        };

        // Detect back navigation or route leave
        const handleBackNavigation = () => {
            console.log("Back button or navigation detected!");
            closeScreen();
        };

        // Navigation guard for detecting when the user tries to leave the route
        onMounted(() => {
            route.meta.handleBackNavigation = handleBackNavigation; // Assign it to meta for later access
        });

        return {
            userData,
            profileFields,
            profileInformation,
            companyDetails,
            closeScreen,
            isZoomOut,
        };
    },
    beforeRouteLeave(to, from, next) {
        // Execute this when user presses back or navigates away from the route
        if (this.isZoomOut === false) {
            this.closeScreen();
            setTimeout(() => {
                next(); // Continue with the navigation after animation
            }, 1000);
        } else {
            next(); // Continue immediately if already zoomed out
        }
    },
};
</script>

<style scoped>
.zoom-animation {
    width: 100%;
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: scale(0);
    animation: zoomIn 1s forwards;
}

.zoom-out {
    animation: zoomOut 1s forwards;
}

.mt-3 p {
    margin: 0;
    padding: 0;
}

@keyframes zoomIn {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes zoomOut {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(0);
        opacity: 0;
    }
}

.fade-in-text {
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.close-btn {
    position: absolute;
    top: 12px;
    right: 2px;
    border: none;
    font-size: 10px;
    padding: 0;
    cursor: pointer;
    z-index: 10;
}

.custom-container {
    min-height: 600px;
}

.custom-height {
    height: 600px;
}

.profile-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.profile-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 992px) {
    .custom-container {
        min-height: 500px;
    }

    .custom-height {
        height: 500px;
    }
}

@media (max-width: 768px) {
    .zoom-animation {
        height: auto;
    }

    .custom-height {
        height: auto;
    }
}

@media (max-width: 480px) {
    .custom-container {
        min-height: 400px;
    }

    .custom-height {
        height: auto;
    }
}
</style>
