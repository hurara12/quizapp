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
                            <!-- <div v-for="quiz in Array.isArray(sortedAvailableQuizzes)
                                ? sortedAvailableQuizzes.filter(quiz => quiz.quiz_id == std_id) // Adjust this condition to your needs
                                : []" :key="quiz.quiz_id" class="card mb-2 w-100"> -->

                            <div v-for="quiz in sortedAvailableQuizzes" :key="quiz.quiz_id" class="card mb-2 w-100">
                                <div class="card-body d-flex flex-row">
                                    <div>
                                        <h5 class="card-title">{{ quiz.quiz_id }}</h5>
                                        <p>Available From: {{ quiz.assigned_at }}</p>
                                        <p>Due Date: {{ quiz.due_at }}</p>
                                    </div>
                                    <button @click="startQuiz(quiz.quiz_id)"
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
                            <div v-for="quiz in sortedRecentQuizzes" :key="quiz.quiz_id" class="card mb-2 w-100">
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
                            <div v-for="quiz in sortedUpcomingQuizzes" :key="quiz.quiz_id" class="card mb-2 w-100">
                                <div class="card-body">
                                    <h5 class="card-title">{{ quiz.quiz_id }}</h5>
                                    <p>Available From: {{ quiz.assigned_at }}</p>
                                    <p>Due Date: {{ quiz.due_at }}</p>
                                    <button @click="notifyMe(quiz.quiz_id)" class="btn btn-notify mt-2">Notify
                                        Me</button>
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
        let std_id = localStorage.getItem('id');
        //const quizzes = ref([]); // All quizzes from the backend

        // Fetch data from the backend
        const fetchData = async () => {
            try {

                console.log("SSStd id ", std_id)
                await store.dispatch('fetchAssignedQuiz'); // Ensure fetching completes
                console.log("assigned ", store.getters.getAssignedQuiz);
                sortedAvailableQuizzes(); // Populate availableQuizzesList after fetch
                sortedUpcomingQuizzes();

                // const token = localStorage.getItem("token");
                // const config = {
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // }

                // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/view-quizzes`, config);
                // console.log("quiz ", response.data);



            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        // Filtering and sorting logic
        const sortedAvailableQuizzes = computed(() => {
            if (!std_id) return []; // Ensure std_id exists

            console.log("F RUNNING")
            return Array.isArray(quizzes.value)
                ? quizzes.value.filter(quiz => quiz.student_id == std_id && quiz.status === 'assigned' &&  // Check if quiz_id matches std_id
                    new Date(quiz.assigned_at) <= new Date() && // Ensure the quiz is available
                    new Date(quiz.due_at) > new Date()          // Ensure it's not past due
                ).sort((a, b) => new Date(a.due_at) - new Date(b.assigned_at))
                : [];
        });

        const sortedRecentQuizzes = computed(() =>
            quizzes.value
                .filter(quiz => quiz.status === 'in-progress' || quiz.status === 'completed')
                .sort((a, b) => new Date(b.attemptedOn || b.missedOn) - new Date(a.attemptedOn || a.missedOn))
        );

        const sortedUpcomingQuizzes = computed(() => {
            if (!std_id) return []; // Ensure std_id exists

            return Array.isArray(quizzes.value) ? quizzes.value
                .filter(quiz =>
                    quiz.student_id == std_id && quiz.status === 'assigned' && new Date(quiz.assigned_at) > new Date() // Filter by student ID and future quizzes
                )
                .sort((a, b) => new Date(a.assigned_at) - new Date(b.assigned_at)) // Sort upcoming quizzes by assigned_at
                : [];
        });


        // Methods for button actions
        const startQuiz = (quizid) => {
            console.log(`Starting quiz: ${quizid}`);
            localStorage.setItem("quizId", quizid)
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
            std_id,
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
