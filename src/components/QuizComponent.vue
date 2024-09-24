<template>
    <div>
        <!-- Quiz Question -->
        <h2>{{ currentQuestion?.question }}</h2>

        <!-- Quiz Options -->
        <ul>
            <li v-for="(option, index) in currentQuestion?.options" :key="index">
                <button @click="selectAnswer(option)">{{ option }}</button>
            </li>
        </ul>

        <!-- Quiz Progress -->
        <p>Question {{ currentQuestionIndex }} of {{ totalQuestions }}</p>
        <p>Time remaining: {{ timeRemaining }} seconds</p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'currentQuestion',
            'currentQuestionIndex',
            'totalQuestions',
            'timeRemaining'
        ])
    },
    methods: {
        ...mapActions(['nextQuestion', 'resetTimer', 'decrementTimer']),

        selectAnswer(answer) {
            // Handle answer selection logic here
            this.nextQuestion();
        }
    },
    created() {
        this.startQuiz();
    },
    watch: {
        timeRemaining(val) {
            if (val === 0) {
                this.nextQuestion();
            }
        }
    },
    methods: {
        ...mapActions(['nextQuestion', 'fetchQuiz', 'resetTimer', 'decrementTimer']),

        startQuiz() {
            this.fetchQuiz(); // Load the quiz initially
            this.startTimer();
        },

        startTimer() {
            this.timerInterval = setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.decrementTimer();
                } else {
                    this.nextQuestion();
                }
            }, 1000); // Decrement every 1 second
        },

        nextQuestion() {
            this.resetTimer(); // Reset the timer for the next question
            this.$store.dispatch('nextQuestion');

            if (this.currentQuestionIndex === this.totalQuestions) {
                clearInterval(this.timerInterval); // Stop the timer after the last question
                this.submitQuiz(); // Optionally, you can submit the quiz here
            }
        },

        submitQuiz() {
            // Handle quiz submission logic here
            console.log('Quiz submitted!');
        }
    },
    beforeUnmount() {
        clearInterval(this.timerInterval); // Clean up the timer when the component is destroyed
    }
};
</script>
