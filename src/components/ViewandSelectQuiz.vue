<template>
    <div class="main-wrap">
        <div class="container mt-4">
            <Header title="Quiz Portal" />
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Available Quizzes</h5>
                        </div>
                        <div class="card-body scrollable-card">
                            <div v-for="quiz in sortedAvailableQuizzes" :key="quiz.id" class="card mb-2 w-100">
                                <div class="card-body d-flex flex-row">
                                    <div>
                                        <h5 class="card-title">{{ quiz.name }}</h5>
                                        <p>Available From: {{ quiz.availableFrom }}</p>
                                        <p>Due Date: {{ quiz.dueDate }}</p>
                                    </div>
                                    <button @click="startQuiz(quiz.name)"
                                        class="btn btn-success ms-auto align-self-end">
                                        Start Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Recent Quizzes</h5>
                        </div>
                        <div class="card-body scrollable-card">
                            <div v-for="quiz in sortedRecentQuizzes" :key="quiz.id" class="card mb-2 w-100">
                                <div class="card-body">
                                    <h5 class="card-title">{{ quiz.name }}</h5>
                                    <p>Score: {{ quiz.score }}%</p>
                                    <p v-if="quiz.status === 'missed'" class="badge bg-danger">Missed</p>
                                    <p v-else-if="quiz.score < 50" class="badge bg-danger">Failed</p>
                                    <p v-else-if="quiz.score >= 50 && quiz.score < 70" class="badge bg-warning">Passed
                                    </p>
                                    <p v-else class="badge bg-success">Success</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

      
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Upcoming Quizzes</h5>
                        </div>
                        <div class="card-body scrollable-card">
                            <div v-for="quiz in sortedUpcomingQuizzes" :key="quiz.id" class="card mb-2 w-100">
                                <div class="card-body">
                                    <h5 class="card-title">{{ quiz.name }}</h5>
                                    <p>Available From: {{ quiz.availableFrom }}</p>
                                    <p>Due Date: {{ quiz.dueDate }}</p>
                                    <button @click="notifyMe(quiz.name)" class="btn btn-notify mt-2">Notify Me</button>
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/HeaderAndLogout.vue';
import { useStore } from 'vuex';

export default {
    name: 'QuizDashboard',
    components: {
        Header,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const quizzes = computed(() => store.getters.getAssignedQuiz);
        //const quizzes = ref([]); // All quizzes from the backend

        // Fetch data from the backend
        const fetchData = async () => {
            try {
                await store.dispatch('fetchAssignedQuiz'); // Ensure fetching completes
                sortedAvailableQuizzes(); // Populate availableQuizzesList after fetch
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        // Filtering and sorting logic
        const sortedAvailableQuizzes = computed(() => {
            return Array.isArray(quizzes.value)
                ? quizzes.value.filter(quiz => new Date(quiz.availableFrom) <= new Date() && new Date(quiz.dueDate) > new Date())
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                : [];
        });


        const sortedRecentQuizzes = computed(() =>
            quizzes.value
                .filter(quiz => quiz.status === 'attempted' || quiz.status === 'missed')
                .sort((a, b) => new Date(b.attemptedOn || b.missedOn) - new Date(a.attemptedOn || a.missedOn))
        );

        const sortedUpcomingQuizzes = computed(() =>
            quizzes.value
                .filter(quiz => new Date(quiz.availableFrom) > new Date())
                .sort((a, b) => new Date(a.availableFrom) - new Date(b.availableFrom))
        );

        // Methods for button actions
        const startQuiz = (quizName) => {
            console.log(`Starting quiz: ${quizName}`);
            router.push('/quizcomponent');
        };

        const notifyMe = (quizName) => {
            console.log(`Notify me for: ${quizName}`);
        };

        // Load data on component mount
        onMounted(fetchData);

        return {
            sortedAvailableQuizzes,
            sortedRecentQuizzes,
            sortedUpcomingQuizzes,
            startQuiz,
            notifyMe,
        };
    },
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
    padding-top: 100px;
}

.custom-gap {
    padding: 0;
}

.card-header {
    background-color: #f8f9fa;
}

.scrollable-card {
    height: 550px;
    overflow-y: auto;
}

.btn-notify {
    background-color: #ffc107;
    border: none;
    color: white;
}

.btn-notify:hover {
    background-color: #e0a800;
}

p {
    padding: 3px;
    margin: 0;
}
</style>
