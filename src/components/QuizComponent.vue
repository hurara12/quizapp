<template>
    <div class="container mt-5">
        <!-- Dropdown to select the quiz -->
        <div class="row">
            <div class="col-6">
                <div class="camera-box">
                    <video ref="camera" autoplay playsinline class="w-100"></video>
                </div>
            </div>
            <div class="col-6">
                <div class="mb-4">
                    <label for="quizSelect" class="form-label">Select a Quiz</label>
                    <select id="quizSelect" class="form-select" v-model="selectedQuizId" @change="loadSelectedQuiz">
                        <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                            {{ quiz.title }}
                        </option>
                    </select>
                </div>

                <!-- Start Quiz Button -->
                <div v-if="selectedQuiz && !quizStarted" class="mb-4">
                    <button class="btn btn-success" @click="startQuiz">Start Quiz</button>
                </div>

                <!-- Quiz questions section -->
                <div v-if="quizStarted && currentQuestion" class="card p-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>{{ selectedQuiz?.title }}</h5>
                        <span>Total Questions: {{ totalQuestions }}</span>
                    </div>

                    <div class="card-body">
                        <p>
                            <strong>{{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}</strong>
                        </p>
                        <div v-for="(option, index) in currentQuestion.options" :key="index" class="form-check">
                            <input class="form-check-input" type="radio" :id="'option' + index" :value="option"
                                v-model="selectedOption" />
                            <label class="form-check-label" :for="'option' + index">
                                {{ option }}
                            </label>
                        </div>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button v-if="currentQuestionIndex < totalQuestions - 1" class="btn btn-primary"
                            @click="submitAnswer">
                            Next
                        </button>
                        <button class="btn btn-danger" @click="finishQuiz">
                            Finish Quiz
                        </button>
                    </div>
                </div>
                <p class="text-danger mt-2" v-if="timeRemaining">
                    Time remaining: {{ timeRemaining }} seconds
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const camera = ref(null);
const streamRef = ref(null);
const router = useRouter();
const store = useStore();

const selectedQuizId = ref(null);
const currentQuestionIndex = ref(0);
const selectedOption = ref('');
const timeRemaining = ref(30);
let timer = null;
const quizStarted = ref(false);
// Fetch quizzes from the store
const quizzes = computed(() => store.state.quizzes);
const selectedQuiz = computed(() => store.state.selectedQuiz);
const questions = computed(() => selectedQuiz.value?.questions || []);
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() =>
    questions.value.length > 0 ? questions.value[currentQuestionIndex.value] : null
);
//camera
const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (camera.value) {
            camera.value.srcObject = stream;
            streamRef.value = stream; // Assign the stream to streamRef
            console.log("Camera started with stream:", stream); // Log the stream to ensure it's assigned
        }
    } catch (err) {
        console.error("Error accessing the camera: ", err);
    }
};

const stopCamera = () => {
    if (streamRef.value) {
        const videoTracks = streamRef.value.getVideoTracks(); // Get only video tracks
        console.log("Stopping video tracks:", videoTracks); // Log to ensure tracks are fetched

        videoTracks.forEach(track => {
            track.stop(); // Stop each video track
        });

        streamRef.value = null; // Clear the stream reference
        console.log("Camera stopped.");
    } else {
        console.log("No camera stream to stop.");
    }
};


// Load selected quiz when selected
const loadSelectedQuiz = () => {
    store.dispatch('selectQuiz', selectedQuizId.value);
    resetTimer();
};

// Function to start the quiz
const startQuiz = () => {
    startCamera();
    quizStarted.value = true;
    resetTimer();
};

// Function to handle answer submission
const submitAnswer = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        moveToNextQuestion();
    } else {
        finishQuiz();
    }
};

// Move to the next question or finish the quiz
const moveToNextQuestion = () => {
    clearInterval(timer);
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++;
        resetTimer();
    } else {
        finishQuiz(); // Automatically finish if on the last question
    }
};

// Function to move to the previous question

// Function to reset the timer
const resetTimer = () => {
    clearInterval(timer); // Clear any existing timer to prevent multiple timers running
    timeRemaining.value = 30;
    timer = setInterval(() => {
        timeRemaining.value--;
        if (timeRemaining.value === 0) {
            submitAnswer(); // Move to next question or finish the quiz if time runs out
        }
    }, 1000);
};

// Function to handle finishing the quiz
const finishQuiz = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        const confirmFinish = confirm(
            'You still have questions left. Are you sure you want to finish the quiz?'
        );
        if (!confirmFinish) {
            return; // If user cancels, stop further execution
        }
    }
    clearInterval(timer); // Stop the timer when the quiz finishes
    quizStarted.value = false;
    stopCamera();
    alert('Quiz finished!');
};
onUnmounted(() => {
    stopCamera();
});
onUnmounted(() => {
    if (camera.value && camera.value.srcObject) {
        const stream = camera.value.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
});

// Fetch quizzes when the component is mounted
onMounted(async () => {
    await store.dispatch('fetchQuizzes');
});

// Clean up timer on component unmount
onBeforeUnmount(() => {
    clearInterval(timer);
});
router.beforeEach((to, from, next) => {
    stopCamera();
    next();
});
</script>

<style scoped>
.card-header {
    background-color: #007bff;
    color: #fff;
}

.form-check-input {
    margin-top: 0.3rem;
    margin-right: 0.5rem;
}

.camera-box {
    width: 100%;
    height: 400px;
    border: 2px solid #007bff;
    border-radius: 10px;
    background-color: #f8f9fa;
    overflow: hidden;
}
</style>
