<template>
    <div class="main-wrap">
        <Header :title="`Quiz: ${quizName}`" />
        <div class="combined-container">

            <!-- I Agree Screen -->
            <div v-if="!started" class="start-container">
                <div class="instruction-card">
                    <h3>Quiz Instructions</h3>
                    <p>Please read the following instructions carefully:</p>
                    <ul>
                        <li>Each question has 4-choice answers.</li>
                        <li>Select the option that best answers the question.</li>
                        <li>You cannot change your answer once selected.</li>
                        <li>Time for each question is 30 seconds</li>
                        <li>Each Question is of 1 mark</li>
                        <li>Good luck!</li>
                    </ul>
                    <button class="btn btn-outline-danger" @click="startQuizAndRecording">I Agree</button>
                </div>
            </div>
            <!-- Main Content: Quiz and Camera -->
            <div v-else class="main-content">
                <!-- Quiz Section -->
                <div class="row">
                    <div class="col-lg-8">
                        <div class="quiz-section border p-3"
                            v-if="questions && questions.length > 0 && finished == false">


                            <div class="row">
                                <div class="col-md-6 text-start">
                                    <p>Current Question: {{ currentQuestionIndex + 1 }} / {{ questions.length }}</p>
                                    <p>
                                        Curr Question Time: <span class="text-danger">{{ remainingTime }} Seconds</span>
                                    </p>
                                </div>
                                <div class="col-md-6 text-end">
                                    <p>Total Questions: {{ questions.length }}</p>
                                    <p>
                                        Time for Quiz: <span class="text-warning">{{ formatTime(quizTime) }}</span>
                                    </p>
                                </div>
                            </div>

                            <!--c Qusestion and Options  -->
                            <div class="questions-section">
                                <div class="card mb-2 p-2">
                                    <h5 class="text-start">{{ currentQuestionIndex + 1 + ". " + currentQuestion.text }}
                                    </h5>
                                    <div class="options-container">
                                        <div v-for="(option, index) in currentQuestion.options" :key="index"
                                            class="option-row text-start">
                                            <input type="radio" :id="'option' + index" class="btn-check"
                                                v-model="selectedOption" :value="option" name="quiz-options" />
                                            <label class="btn btn-outline-info option-label" :for="'option' + index">
                                                {{ getOptionLabel(index) }}. {{ option }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Quiz Buttons -->
                            <div class="quiz-buttons d-flex justify-content-end">
                                <!-- Check if the current question is the last one -->
                                <button v-if="currentQuestionIndex < questions.length - 1"
                                    class="btn btn-secondary me-3" @click="confirmSkip">
                                    Next
                                </button>

                                <button v-else class="btn btn-primary me-3" @click="confirmSkip">
                                    Submit
                                </button>
                                <!-- Hide "Finish Quiz" button if on the last question -->
                                <button v-if="currentQuestionIndex < questions.length - 1" class="btn btn-danger"
                                    @click="confirmFinish">
                                    Finish Quiz
                                </button>
                            </div>

                        </div>
                        <div v-else-if="!finished">
                            Loading questions...
                        </div>


                        <!-- Skip Confirmation Modal -->
                        <div v-if="showSkipConfirmation" class="confirmation-modal">
                            <p>Are you sure you want to skip this question?</p>
                            <button class="btn btn-warning me-3" @click="skipQuestion(true)">Yes</button>
                            <button class="btn btn-secondary" @click="skipQuestion(false)">No</button>
                        </div>

                        <div v-if="showFinishConfirmation" class="confirmation-modal">
                            <p>You have remaining questions, are you sure you want to finish the quiz?</p>
                            <button class="btn btn-danger me-3" @click="finishQuiz(true)">Yes</button>
                            <button class="btn btn-secondary" @click="finishQuiz(false)">No</button>
                        </div>
                    </div>

                    <div v-if="!finished" class="camera-section mt-4 col-lg-4">
                        <div class="camera-box">
                            <video ref="camera" autoplay playsinline class="w-100"></video>
                        </div>
                    </div>
                </div>
                <div v-if="finished" class="start-container">
                    <div class="instruction-card">
                        <h3 class="card-subtitle mb-2 text-muted text-center">Your Quiz is Finished</h3>
                        <p class="card-text m-0 p-1">Total Questions: {{ questions.length }}</p>
                        <p class="card-text m-0 p-1">Attempted Questions: {{ attemptedQuestions }}</p>
                        <p class="card-text m-0 p-1">Correct Questions: {{ correctAnswers }}</p>
                        <p class="card-text m-0 p-1">Marks: {{ correctAnswers }} / {{ questions.length }}</p>
                        <p class="card-text m-0 p-1">Attempted in: <span>{{ formatTime(quizTime) }}</span></p>
                        <button class="btn btn-secondary" @click="goBack">Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from "vue-router";
import Header from '@/components/HeaderAndLogout.vue'; // 
export default {
    name: 'CombinedQuizAndRecording',
    components: {
        Header,
    },
    setup() {
        const router = useRouter();
        const started = ref(false);
        const finished = ref(false);
        const currentQuestionIndex = ref(0);
        const selectedOption = ref(null);
        const quizTime = ref(0);
        const remainingTime = ref(30);
        const questions = ref([]);
        const correctAnswers = ref(0);
        const attemptedQuestions = ref(0);
        const showSkipConfirmation = ref(false);
        const showFinishConfirmation = ref(false);
        let quizName = ref('');
        let questionTimer = null;
        let quizTimer = null;

        // === Camera and Recording State Variables ===
        const camera = ref(null);
        const streamRef = ref(null);
        const mediaRecorder = ref(null);
        const recordedChunks = ref([]);
        const isRecording = ref(false);

        // === Computed Properties ===
        const currentQuestion = computed(() => {
            if (questions.value.length === 0) {
                return { text: 'Loading...', options: [] };
            }
            return questions.value[currentQuestionIndex.value] || { text: 'No more questions', options: [] };
        });

        // === Lifecycle Hooks ===
        onMounted(() => {
            // Load sample questions
            quizName.value = "History"
            questions.value = [
                {
                    text: "Which philosopher would start with a tabula rasa and then develop ethical standards?",
                    options: ["John Locke", "David Geffen", "John Rawls", "Peter Drucker"],
                    correct: "John Locke",
                },
                {
                    text: "Who wrote the book 'Republic'?",
                    options: ["Plato", "Aristotle", "Socrates", "Descartes"],
                    correct: "Plato",
                },
                {
                    text: "Which philosopher is known for the categorical imperative?",
                    options: ["Immanuel Kant", "David Hume", "Nietzsche", "Bertrand Russell"],
                    correct: "Immanuel Kant",
                },
                // Add more test questions here
            ];
        });

        onBeforeUnmount(() => {
            // Automatically finish quiz and stop recording when component is unmounted
            if (started.value && !finished.value) {
                finishQuiz(true);
                stopRecording();
            }
        });

        // === Quiz Methods ===
        const startQuizAndRecording = async () => {
            started.value = true;
            startTimers();
            await startRecording(); // Start recording when quiz starts
        };

        const startTimers = () => {
            // Main Quiz Timer
            quizTimer = setInterval(() => {
                quizTime.value++;
            }, 1000);

            // Start the first question timer
            startQuestionTimer();
        };

        const startQuestionTimer = () => {
            remainingTime.value = 30;
            questionTimer = setInterval(() => {
                remainingTime.value--;
                if (remainingTime.value === 0) {
                    nextQuestion();
                }
            }, 1000);
        };

        const nextQuestion = () => {
            // Check if the selected option is correct
            if (selectedOption.value === currentQuestion.value.correct) {
                correctAnswers.value++;
            }
            if (selectedOption.value) attemptedQuestions.value++;
            selectedOption.value = null;
            clearInterval(questionTimer);

            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                startQuestionTimer();
            } else {
                finishQuiz(true);
            }
        };

        const confirmSkip = () => {
            if (!selectedOption.value) {
                showSkipConfirmation.value = true;
            } else {
                nextQuestion();
            }
        };

        const skipQuestion = (confirmed) => {
            showSkipConfirmation.value = false;
            if (confirmed) {
                nextQuestion();
            }
        };

        const confirmFinish = () => {
            showFinishConfirmation.value = true;
        };

        const finishQuiz = (confirmed) => {
            showFinishConfirmation.value = false;
            if (confirmed) {
                clearInterval(quizTimer);
                clearInterval(questionTimer);
                finished.value = true;
                stopRecording(); // Stop recording when quiz finishes
            }
        };

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        };

        const getOptionLabel = (index) => {
            const labels = ['A', 'B', 'C', 'D'];
            return labels[index] || '';
        };

        // === Camera and Recording Methods ===
        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (camera.value) camera.value.srcObject = stream;

                streamRef.value = stream;
                isRecording.value = true;

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

        const stopRecording = () => {
            if (streamRef.value) {
                streamRef.value.getTracks().forEach((track) => track.stop());
                streamRef.value = null;
                console.log("Camera and microphone stopped.");
            }
            if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
                mediaRecorder.value.stop();
            }
            isRecording.value = false;
        };
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
        const goBack = () => {
            router.replace("/viewandselectquiz");
        };
        // Automatically save recording when the document is not visible
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isRecording.value) {
                stopRecording();
                saveVideoToLocal();
            }
        };
        // Add event listener for visibility change to handle tab/browser switches
        onMounted(() => {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        });

        // Remove event listener on unmount
        onBeforeUnmount(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        });

        return {
            // === Quiz Data and Methods ===
            started,
            finished,
            currentQuestion,
            currentQuestionIndex,
            selectedOption,
            remainingTime,
            quizTime,
            correctAnswers,
            attemptedQuestions,
            showSkipConfirmation,
            showFinishConfirmation,
            startQuizAndRecording,
            confirmSkip,
            skipQuestion,
            confirmFinish,
            finishQuiz,
            formatTime,
            getOptionLabel,
            questions,
            goBack,
            // === Camera and Recording Data and Methods ===
            camera,
            isRecording,
            quizName,
        };
    },
};
</script>

<style scoped>
p {
    padding: 4px;
    margin: 5px;
}

.main-wrap {
    background-color: #fbe9d0;
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    /* Changed from center to flex-start */
    justify-content: center;
    padding-top: 90px;
}

.combined-container {
    /* Container for the combined quiz and camera components */
    width: 1024px;
    max-width: 100%;
    /* Ensures the container doesn't exceed the screen width */
    margin: auto;
    padding: 25px;
}

.start-container {
    display: flex;
    align-items: flex-start;
    /* Changed from center to flex-start */
    justify-content: center;
    /* Center vertically */
}

.instruction-card {
    border: 1px solid #007bff;
    /* Bootstrap primary color */
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    /* Limit the card width */
    text-align: center;
    background-color: #f8f9fa;
    /* Light background for contrast */
}

.instruction-card h3 {
    margin-bottom: 15px;
}

.instruction-card p {
    text-align: left;
    /* Align list to the left */
    margin-bottom: 10px;
}

.instruction-card ul {
    text-align: left;
    /* Align list to the left */
    margin-bottom: 15px;
}



.quiz-section {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.questions-section {
    margin-top: 10px;
}

.card {
    background-color: #ffffff;
}

.options-container {
    display: flex;
    flex-direction: column;
}

.option-row {
    display: flex;
    align-items: center;
    width: 100%;
    /* Ensures all rows take the full width */
    margin-bottom: 0px;
    /* Spacing between options */
}

.option-label {
    flex-grow: 1;
    /* Allows the label to take available space */
    text-align: left;
    /* Align text to the left */
    padding: 10px;
    /* Add padding for a better appearance */
    display: block;
    /* Ensure the label behaves as a block element */
}

.quiz-buttons {
    margin-top: 10px;
}

.confirmation-modal {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}



.camera-box {
    width: 500px;
    height: 500px;
    border: 2px solid #eeb4b4;
    border-radius: 10px;
    background-color: #f8f9fa;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Ensures the video covers the box without distortion */
}

.btn {
    margin-top: 20px;
}

/* Media query for large screens (above 1384px) */
@media (min-width: 1384px) {
    .combined-container {
        width: 100%;
        max-width: 1384px;
        padding: 20px;
    }

    .camera-box {
        width: 400px;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* Media query for screens between 1024px and 1384px */
@media (max-width: 1384px) and (min-width: 1024px) {
    .combined-container {
        width: 100%;
        max-width: 1024px;
        padding: 15px;
    }

    .camera-box {
        width: 300px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* Media query for screens between 768px and 1024px (tablet size) */
@media (max-width: 1024px) and (min-width: 768px) {
    .combined-container {
        width: 100%;
        max-width: 768px;
        padding: 15px;
    }

    .camera-box {
        width: 400px;
        height: 400px;
        margin: 0 auto;
        /* Centers the camera on medium screens */
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* Media query for screens between 480px and 768px (small tablets and larger mobile devices) */
@media (max-width: 768px) and (min-width: 480px) {
    .combined-container {
        width: 100%;
        max-width: 768px;
        padding: 10px;
    }

    .camera-box {
        width: 400px;
        height: 400px;
        margin: 0 auto;
        /* Centers the camera */
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

/* Media query for screens less than or equal to 480px (mobile size) */
@media (max-width: 480px) {
    .combined-container {
        width: 100%;
        max-width: 100%;
        padding: 5px;
    }

    .camera-box {
        width: 300px;
        height: 300px;
        margin: 0 auto;
        /* Centers the camera */
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
