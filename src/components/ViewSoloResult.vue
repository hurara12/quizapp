<template>
    <div class="zoom-animation" :class="{ 'zoom-out': isZoomOut }">
        <div>
            <div class="custom-container">
                <!-- <button @click="closeScreen" class="close-btn btn btn-primary">
                    x
                </button> -->
                <div class="row">
                    <!-- Profile Card -->
                    <!-- <div class="col-12 col-md-4">
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
                    </div> -->
                    <!-- Editable Profile Form -->
                    <div class="col-12 col-md-12">
                        <div class="card custom-height">
                            <div class="card-body">
                                <div class="row">
                                    <h5 class="text-center text-muted">Profile Information</h5>
                                    <div class="col-md-4">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item" v-for="(value, label) in userData" :key="label">
                                                <strong>{{ label }}:</strong> {{ value }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-md-8">

                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="d-flex justify-content-end align-items-center mb-3">
                                                <label for="viewOption" class="me-2">View as:</label>
                                                <select v-model="view" id="viewOption" class="form-select w-auto">
                                                    <option value="simple">Simple View</option>
                                                    <option value="markColor">Mark Color</option>
                                                </select>
                                            </div>

                                            <div class="table-responsive">
                                                <table class="table table-striped table-hover">
                                                    <thead class="table-dark">
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Marks</th>
                                                            <th>Time</th> <!-- attempted time -->
                                                            <th>Duration</th> <!-- took time to attempt quiz -->
                                                            <th>Percentage</th>
                                                            <th>Status</th>
                                                            <th>View</th>
                                                            <th>Recording</th>
                                                            <th>
                                                                Approve/Reject
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="quiz in quizzes" :key="quiz.id"
                                                            :class="rowClass(quiz)">
                                                            <td>{{ quiz.name }}</td>
                                                            <td>{{ quiz.marks }}</td>
                                                            <td>{{ quiz.attemptedTime }}</td>
                                                            <td>{{ quiz.duration }}</td>
                                                            <td>{{ quiz.percentage }}%</td>
                                                            <td>{{ quiz.status }}</td>
                                                            <td><button class="btn btn-outline-info btn-sm">View
                                                                    Detail</button>
                                                            </td>
                                                            <td><button class="btn btn-outline-primary btn-sm ">View
                                                                    Recording</button>
                                                            </td>
                                                            <td>
                                                                <button class="b-none"><font-awesome-icon
                                                                        :icon="['far', 'circle-check']"
                                                                        style="color: #198754;" class="fa-2x" />
                                                                </button>
                                                                <button class="b-none"><font-awesome-icon
                                                                        :icon="['far', 'circle-xmark']"
                                                                        style="color: #dc3545;" class="fa-2x" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
        const view = ref('simple');
        const router = useRouter();
        const route = useRoute();
        const userData = ref({

            Name: "john_doe",
            Email: "hurara@gmail.com",
            "Total Quiz": 55,
            "Average %": "88%",
        });
        const isZoomOut = ref(false);


        const profileInformation = computed(() => {
            // const { address, city, stateCode, postalCode, country } = userData.value.company.address || {};
            // return {
            //     "name": userData.value.username,
            //     Password: userData.value.password,
            //     Address: `${address || ""}, ${city || ""}, ${stateCode || ""} ${postalCode || ""} ${country || ""}`,
            // };
        });

        const companyDetails = computed(() => {
            // const { name, department, title, address } = userData.value.company || {};
            // return {
            //     "Company Name": name,
            //     Department: department,
            //     Title: title,
            //     Address: `${address?.address || ""}, ${address?.city || ""}, ${address?.stateCode || ""} ${address?.postalCode || ""} ${address?.country || ""}`,
            // };
        });

        const quizzes = ref([
            {
                id: 1,
                name: "Quiz 1",
                marks: "90 / 100",
                attemptedTime: "10:00 AM",
                duration: "30 mins",
                percentage: 90,
                status: "Passed",
            },
            {
                id: 2,
                name: "Quiz 2",
                marks: "70 / 100",
                attemptedTime: "11:00 AM",
                duration: "25 mins",
                percentage: 70,
                status: "Passed",
            },
            {
                id: 3,
                name: "Quiz 3",
                marks: "55 / 100",
                attemptedTime: "12:00 PM",
                duration: "35 mins",
                percentage: 55,
                status: "Failed",
            },
            {
                id: 1,
                name: "Quiz 1",
                marks: "90 / 100",
                attemptedTime: "10:00 AM",
                duration: "30 mins",
                percentage: 90,
                status: "Passed",
            },
            {
                id: 2,
                name: "Quiz 2",
                marks: "70 / 100",
                attemptedTime: "11:00 AM",
                duration: "25 mins",
                percentage: 70,
                status: "Passed",
            },
            {
                id: 3,
                name: "Quiz 3",
                marks: "55 / 100",
                attemptedTime: "12:00 PM",
                duration: "35 mins",
                percentage: 55,
                status: "Failed",
            },
            {
                id: 1,
                name: "Quiz 1",
                marks: "90 / 100",
                attemptedTime: "10:00 AM",
                duration: "30 mins",
                percentage: 90,
                status: "Passed",
            },
            {
                id: 2,
                name: "Quiz 2",
                marks: "70 / 100",
                attemptedTime: "11:00 AM",
                duration: "25 mins",
                percentage: 70,
                status: "Passed",
            },
            {
                id: 3,
                name: "Quiz 3",
                marks: "55 / 100",
                attemptedTime: "12:00 PM",
                duration: "35 mins",
                percentage: 55,
                status: "Failed",
            },
            {
                id: 1,
                name: "Quiz 1",
                marks: "90 / 100",
                attemptedTime: "10:00 AM",
                duration: "30 mins",
                percentage: 90,
                status: "Passed",
            },
            {
                id: 2,
                name: "Quiz 2",
                marks: "70 / 100",
                attemptedTime: "11:00 AM",
                duration: "25 mins",
                percentage: 70,
                status: "Passed",
            },
            {
                id: 3,
                name: "Quiz 3",
                marks: "55 / 100",
                attemptedTime: "12:00 PM",
                duration: "35 mins",
                percentage: 55,
                status: "Failed",
            },
            {
                id: 1,
                name: "Quiz 1",
                marks: "90 / 100",
                attemptedTime: "10:00 AM",
                duration: "30 mins",
                percentage: 90,
                status: "Passed",
            },
            {
                id: 2,
                name: "Quiz 2",
                marks: "70 / 100",
                attemptedTime: "11:00 AM",
                duration: "25 mins",
                percentage: 70,
                status: "Passed",
            },
            {
                id: 3,
                name: "Quiz 3",
                marks: "55 / 100",
                attemptedTime: "12:00 PM",
                duration: "35 mins",
                percentage: 55,
                status: "Failed",
            }
        ]);

        const rowClass = (quiz) => {
            if (view.value === 'markColor') {
                if (quiz.percentage > 80) return 'table-success';
                else if (quiz.percentage >= 60) return 'table-warning';
                else return 'table-danger';
            }
            return '';
        };

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
            profileInformation,
            companyDetails,
            closeScreen,
            isZoomOut,
            view,
            quizzes,
            rowClass,
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
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: scale(0);
    animation: zoomIn 1s forwards;
    background-color: #fbe9d0;
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

.b-none {
    border: none;
    background-color: transparent
}

.custom-container {
    min-height: 700px;
}

.custom-height {
    height: 700px;
}

.profile-card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.profile-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.table-responsive {
    height: 400px;
    overflow-y: auto;
}

th,
td {
    white-space: nowrap;
}

thead th {
    position: sticky;
    top: 0;
    z-index: 1;
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
