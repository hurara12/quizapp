<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-6">
                <div class="camera-box">
                    <video ref="camera" autoplay playsinline class="w-100"></video>
                </div>
                <canvas ref="frequencyCanvas" class="w-100 mt-3"></canvas>
            </div>
            <div class="col-6">
                <div class="mb-4">
                    <label for="quizSelect" class="form-label">Select a Quiz</label>
                    <select id="quizSelect" class="form-select" v-model="selectedQuizId" @change="loadSelectedQuiz">
                        <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
                    </select>
                </div>

                <div v-if="selectedQuiz && !quizStarted" class="mb-4">
                    <button class="btn btn-success" @click="startQuiz">Start Quiz</button>
                </div>

                <div v-if="quizStarted && currentQuestion" class="card p-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>{{ selectedQuiz?.title }}</h5>
                        <span>Total Questions: {{ totalQuestions }}</span>
                    </div>

                    <div class="card-body">
                        <p><strong>{{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}</strong></p>
                        <div v-for="(option, index) in currentQuestion.options" :key="index" class="form-check">
                            <input class="form-check-input" type="radio" :id="'option' + index" :value="option"
                                v-model="selectedOption" />
                            <label class="form-check-label" :for="'option' + index">{{ option }}</label>
                        </div>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button v-if="currentQuestionIndex < totalQuestions - 1" class="btn btn-primary"
                            @click="submitAnswer">Next</button>
                        <button class="btn btn-danger" @click="finishQuiz">Finish Quiz</button>
                    </div>
                </div>

                <p class="text-danger mt-2" v-if="timeRemaining">Time remaining: {{ timeRemaining }} seconds</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();

const camera = ref(null);
const frequencyCanvas = ref(null);
const streamRef = ref(null);
const audioContext = ref(null);
const mediaRecorder = ref(null);
const recordedChunks = ref([]);

const selectedQuizId = ref(null);
const currentQuestionIndex = ref(0);
const selectedOption = ref('');
const timeRemaining = ref(30);
const timer = ref(null);
const quizStarted = ref(false);
const isRecording = ref(false);

const quizzes = computed(() => store.state.quizzes);
const selectedQuiz = computed(() => store.state.selectedQuiz);
const questions = computed(() => selectedQuiz.value?.questions || []);
const totalQuestions = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null);

// Start recording function
const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (camera.value) camera.value.srcObject = stream;

        streamRef.value = stream;
        isRecording.value = true;
        startMicrophoneFrequency(stream);

        mediaRecorder.value = new MediaRecorder(stream);
        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) recordedChunks.value.push(event.data);
        };
        mediaRecorder.value.onstop = saveVideoToLocal;

        mediaRecorder.value.start();
    } catch (err) {
        console.error("Error accessing camera or microphone: ", err);
    }
};

// Start analyzing microphone frequency
const startMicrophoneFrequency = (stream) => {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.value.createMediaStreamSource(stream);
    const analyser = audioContext.value.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 2048;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const drawFrequency = () => {
        if (!frequencyCanvas.value) return console.error('Canvas not ready for drawing.');

        requestAnimationFrame(drawFrequency);
        const canvasContext = frequencyCanvas.value.getContext('2d');
        analyser.getByteTimeDomainData(dataArray);
        canvasContext.clearRect(0, 0, frequencyCanvas.value.width, frequencyCanvas.value.height);

        // Drawing logic remains unchanged
        // ...
    };

    drawFrequency();
};

// Stop recording function
const stopRecording = () => {
    if (streamRef.value) {
        streamRef.value.getTracks().forEach((track) => track.stop());
        streamRef.value = null;
        console.log("Camera and microphone stopped.");
    }

    if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
        mediaRecorder.value.stop();
    }

    if (audioContext.value) {
        audioContext.value.close().catch(err => console.error("Error closing AudioContext:", err));
    }

    isRecording.value = false;
};

// Save recorded video to local
const saveVideoToLocal = () => {
    const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    recordedChunks.value = [];
};

// Load selected quiz
const loadSelectedQuiz = () => {
    store.dispatch('selectQuiz', selectedQuizId.value);
    resetTimer();
};

// Start the quiz
const startQuiz = () => {
    startRecording();
    quizStarted.value = true;
    resetTimer();
};

// Submit answer and move to next question
const submitAnswer = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        moveToNextQuestion();
    } else {
        finishQuiz();
    }
};

// Move to the next question or finish the quiz
const moveToNextQuestion = () => {
    clearInterval(timer.value);
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++;
        resetTimer();
    } else {
        finishQuiz(); // Automatically finish if on the last question
    }
};

// Reset the timer
const resetTimer = () => {
    clearInterval(timer.value);
    timeRemaining.value = 30;
    timer.value = setInterval(() => {
        timeRemaining.value--;
        if (timeRemaining.value === 0) submitAnswer();
    }, 1000);
};

// Finish the quiz
const finishQuiz = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        const confirmFinish = confirm('You still have questions left. Are you sure you want to finish the quiz?');
        if (!confirmFinish) return;
    }
    clearInterval(timer.value);
    quizStarted.value = false;
    stopRecording();
    alert('Quiz finished!');
};

// Cleanup on component unmount
onUnmounted(() => {
    if (isRecording.value) stopRecording();
    clearInterval(timer.value);
});

// Fetch quizzes on mount
onMounted(async () => {
    await store.dispatch('fetchQuizzes');
});

// Clean up timer on component unmount
onBeforeUnmount(() => {
    clearInterval(timer.value);
});

// Stop recording on route change
router.beforeEach((to, from, next) => {
    stopRecording();
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

canvas {
    width: 100%;
    height: 100px;
    background-color: #f8f9fa;
    border: 2px solid #007bff;
    border-radius: 10px;
}
</style>
