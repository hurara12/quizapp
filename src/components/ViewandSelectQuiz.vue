<template>
    <div class="main-wrap">
        <div class="container mt-4">
            <Header title="Quiz Portal" />
            <!-- Assigned Quizzes -->
            <div class="row"> <!-- Added g-4 for gutter spacing -->
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Available Quizzes</h5>
                        </div>
                        <div class="card-body scrollable-card">
                            <div v-for="quiz in assignedQuizzes" :key="quiz.id" class="card mb-2 w-100">
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

                <!-- Attempted Quizzes -->
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Attempted Quizzes</h5>
                        </div>
                        <div class="card-body scrollable-card d-flex flex-column">
                            <div v-for="quiz in attemptedQuizzes" :key="quiz.id" class="card mb-2 w-100">
                                <div class="card-body">
                                    <h5 class="card-title">{{ quiz.name }}</h5>
                                    <p>Score: {{ quiz.score }}%</p>
                                    <button @click="viewResults(quiz.name)" class="btn btn-secondary mt-2">View
                                        Results</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pending Quizzes -->
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card custom-gap mb-4">
                        <div class="card-header">
                            <h5>Upcoming Quiz</h5>
                        </div>
                        <div class="card-body scrollable-card d-flex flex-column">
                            <div v-for="quiz in pendingQuizzes" :key="quiz.id" class="card mb-2 w-100">
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
import { useRouter } from "vue-router";
import { ref } from 'vue';
import Header from '@/components/HeaderAndLogout.vue'; // 

export default {
    name: 'QuizDashboard',
    components: {
        Header,
    },
    setup() {
        const router = useRouter();
        // Dummy data for quizzes
        const assignedQuizzes = ref([
            { id: 1, name: 'Literature Quiz', availableFrom: '2024-10-01', dueDate: '2024-10-10' },
            { id: 2, name: 'Physics Quiz', availableFrom: '2024-10-03', dueDate: '2024-10-12' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
        ]);

        const attemptedQuizzes = ref([
            { id: 1, name: 'History Quiz', score: 85 },
            { id: 2, name: 'Geography Quiz', score: 90 },
            { id: 3, name: 'Math Quiz', score: 78 },
            { id: 3, name: 'Math Quiz', score: 78 },
            { id: 3, name: 'Math Quiz', score: 78 },
            { id: 3, name: 'Math Quiz', score: 78 },
            { id: 3, name: 'Math Quiz', score: 78 },
        ]);

        const pendingQuizzes = ref([
            { id: 1, name: 'Literature Quiz', availableFrom: '2024-10-01', dueDate: '2024-10-10' },
            { id: 2, name: 'Physics Quiz', availableFrom: '2024-10-03', dueDate: '2024-10-12' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
            { id: 3, name: 'Chemistry Quiz', availableFrom: '2024-11-01', dueDate: '2024-11-15' },
        ]);

        // Methods for button actions
        const startQuiz = (quizName) => {
            console.log(`Starting quiz: ${quizName}`);
            router.push('/quizcomponent')
        };

        const viewResults = (quizName) => {
            console.log(`Viewing results for: ${quizName}`);
        };

        const notifyMe = (quizName) => {
            console.log(`Notify me for: ${quizName}`);
        };

        return {
            assignedQuizzes,
            attemptedQuizzes,
            pendingQuizzes,
            startQuiz,
            viewResults,
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
