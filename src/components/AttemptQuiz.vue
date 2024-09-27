<template>
    <div class="quiz-container">

        <!-- Start Quiz Button -->
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
                <button class="btn btn-outline-danger" @click="startQuiz">I Agree</button>
            </div>
        </div>

        <!-- Quiz Section -->
        <div v-else>
            <div class="quiz-creation-section border p-3" v-if="questions && questions.length > 0 && finished == false">
                <p>Total Questions: {{ questions.length }}</p>
                <p>Current Question: {{ currentQuestionIndex + 1 }} / {{ questions.length }}</p>
                <p>Time for Quiz: <span class="text-warning">{{ formatTime(quizTime) }}</span></p>
                <p>Remaining Time for this Question: <span class="text-danger">{{ remainingTime }}</span></p>

                <!-- Question and Options -->
                <div class="questions-section">
                    <div class="card mb-4 p-3">
                        <h5 class="text-start">{{ currentQuestionIndex + 1 + ". " + currentQuestion.text }}</h5>
                        <div class="options-container">
                            <div v-for="(option, index) in currentQuestion.options" :key="index"
                                class="option-row text-start">
                                <input type="radio" :id="'option' + index" class="btn-check" v-model="selectedOption"
                                    :value="option" name="quiz-options" />
                                <label class="btn btn-outline-info option-label" :for="'option' + index">
                                    {{ getOptionLabel(index) }}. {{ option }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz Buttons -->
                <div class="quiz-buttons d-flex justify-content-end">
                    <button class="btn btn-secondary me-3" @click="confirmSkip">Next</button>
                    <button class="btn btn-danger" @click="confirmFinish">Finish Quiz</button>
                </div>
            </div>
            <div v-else>
                Loading questions...
            </div>

            <!-- Skip Confirmation Modal -->
            <div v-if="showSkipConfirmation" class="confirmation-modal">
                <p>Are you sure you want to skip this question?</p>
                <button class="btn btn-warning me-3" @click="skipQuestion(true)">Yes</button>
                <button class="btn btn-secondary" @click="skipQuestion(false)">No</button>
            </div>

            <!-- Finish Confirmation Modal -->
            <div v-if="showFinishConfirmation" class="confirmation-modal">
                <p>You have remaining questions, are you sure you want to finish the quiz?</p>
                <button class="btn btn-danger me-3" @click="finishQuiz(true)">Yes</button>
                <button class="btn btn-secondary" @click="finishQuiz(false)">No</button>
            </div>

            <!-- Results Section -->
            <div v-if="finished" class="result-container">
                <h3>Quiz Finished</h3>
                <p>Marks: {{ correctAnswers }} / {{ questions.length }}</p>
                <p>Attempted Questions: {{ attemptedQuestions }}</p>
                <p>Correct Questions: {{ correctAnswers }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
    setup() {
        const started = ref(false);
        const finished = ref(false);
        const currentQuestionIndex = ref(0);
        const selectedOption = ref(null);
        const quizTime = ref(0);
        const remainingTime = ref(30);

        // Initialize questions as an empty array
        const questions = ref([]);

        // For tracking scores
        const correctAnswers = ref(0);
        const attemptedQuestions = ref(0);

        const showSkipConfirmation = ref(false);
        const showFinishConfirmation = ref(false);

        let questionTimer = null;
        let quizTimer = null;

        // Computed property for the current question, with safety checks
        const currentQuestion = computed(() => {
            if (questions.value.length === 0) {
                return { text: 'Loading...', options: [] };
            }
            return questions.value[currentQuestionIndex.value] || { text: 'No more questions', options: [] };
        });

        // Load sample data in onMounted hook
        onMounted(() => {
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

        const startQuiz = () => {
            started.value = true;
            startTimers();
        };

        const startTimers = () => {
            // Main Quiz Timer
            quizTimer = setInterval(() => {
                quizTime.value++;
            }, 1000);

            // Question Timer
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

        return {
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
            startQuiz,
            confirmSkip,
            skipQuestion,
            confirmFinish,
            finishQuiz,
            formatTime,
            getOptionLabel,
            questions // Make sure to return questions as well
        };
    },
};
</script>

<style scoped>
.start-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
    margin-bottom: 10px;
}

.instruction-card ul {
    text-align: left;
    /* Align list to the left */
    margin-bottom: 15px;
}

.quiz-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    text-align: center;
}

.question-container {
    margin: 20px 0;
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
    margin-bottom: 10px;
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

.result-container {
    text-align: center;
}


.quiz-creation-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
}


.card {
    background-color: #ffffff;
}
</style>
