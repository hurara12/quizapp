<template>
    <div class="main-wrap">
        <div class="zoom-animation" :class="{ 'zoom-out': isZoomOut }">
            <div>
                <div class="custom-container">
                    <div class="row">

                        <div class="col-12 col-md-12">
                            <div class="card custom-height">
                                <div class="card-body">
                                    <div class="row">
                                        <h5 class="text-center text-muted">Profile Information</h5>
                                        <div class="col-md-4">
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item" v-for="(value, label) in userData"
                                                    :key="label">
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
                                                                <th>Time</th>
                                                                <th>Duration</th>
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


        const handleBackNavigation = () => {
            console.log("Back button or navigation detected!");
            closeScreen();
        };

        onMounted(() => {
            route.meta.handleBackNavigation = handleBackNavigation; // Assign it to meta for later access
        });

        return {
            userData,
            closeScreen,
            isZoomOut,
            view,
            quizzes,
            rowClass,
        };
    },
    beforeRouteLeave(to, from, next) {

        if (this.isZoomOut === false) {
            this.closeScreen();
            setTimeout(() => {
                next();
            }, 1000);
        } else {
            next();
        }
    },
};
</script>

<style scoped>
.main-wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fbe9d0;
}

.zoom-animation {
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
