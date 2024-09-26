<template>
    <div class="container mt-4">
        <!-- Assigned Quizzes -->
        <div class="row"> <!-- Added g-4 for gutter spacing -->
            <div class="custom-gap card mb-4 col-sm-12 col-md-6 col-lg-4">
                <div class="card-header">
                    <h5>Available Quizzes</h5>
                </div>
                <div class="card-body scrollable-card">
                    <div v-for="quiz in assignedQuizzes" :key="quiz.id" class="card mb-2 w-100">
                        <div class="card-body d-flex flex-row">
                            <div>{{ quiz.name }}</div>
                            <button @click="startQuiz(quiz.name)" class="btn btn-success ms-auto align-self-end">
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Attempted Quizzes -->
            <div class="card custom-gap mb-4 col-sm-12 col-md-6 col-lg-4">
                <div class="card-header">
                    <h5>Attempted Quizzes</h5>
                </div>
                <div class="card-body scrollable-card d-flex flex-column">
                    <div v-for="quiz in attemptedQuizzes" :key="quiz.id" class="card mb-2 w-100">
                        <div class="card-body">
                            <h5 class="card-title">{{ quiz.name }}</h5>
                            <p>Score: {{ quiz.score }}%</p>
                            <button @click="viewResults(quiz.name)" class="btn btn-secondary">View Results</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Quizzes -->
            <div class="card custom-gap mb-4 col-sm-12 col-md-6 col-lg-4">
                <div class="card-header">
                    <h5>Upcoming Quiz</h5>
                </div>
                <div class="card-body scrollable-card d-flex flex-column">
                    <div v-for="quiz in pendingQuizzes" :key="quiz.id" class="card mb-2 w-100">
                        <div class="card-body">
                            <h5 class="card-title">{{ quiz.name }}</h5>
                            <p>Available From: {{ quiz.availableFrom }}</p>
                            <p>Due Date: {{ quiz.dueDate }}</p>
                            <button @click="notifyMe(quiz.name)" class="btn btn-notify">Notify Me</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref } from 'vue';

export default {
    name: 'QuizDashboard',
    setup() {
        // Dummy data for quizzes
        const assignedQuizzes = ref([
            { id: 1, name: 'Advanced JavaScript' },
            { id: 2, name: 'JavaScript Basics' },
            { id: 3, name: 'React Essentials' },
            { id: 4, name: 'Vue Mastery' },
            { id: 5, name: 'Node.js Fundamentals' },
            { id: 6, name: 'Node.js Fundamentals' },
            { id: 7, name: 'Node.js Fundamentals' },
            { id: 8, name: 'Node.js Fundamentals' },
            { id: 5, name: 'Node.js Fundamentals' },
            { id: 6, name: 'Node.js Fundamentals' },
            { id: 7, name: 'Node.js Fundamentals' },
            { id: 8, name: 'Node.js Fundamentals' },
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
.custom-gap {
    padding: 0;
}

.card-header {
    background-color: #f8f9fa;
}

.scrollable-card {
    max-height: 600px;
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
</style>
