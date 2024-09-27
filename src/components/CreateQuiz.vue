<template>
    <div class="container mt-5">
        <div class="row g-3">
            <!-- First Div: Quiz Creation Section (lg: 7 cols) -->
            <div class="col-lg-7">
                <form @submit.prevent="createOrUpdateQuiz">
                    <div class="quiz-creation-section border p-3">
                        <h3>Create Quiz</h3>
                        <div class="mb-3">
                            <label for="quizName" class="form-label">Quiz Name</label>
                            <input type="text" class="form-control" id="quizName" v-model="quiz.name"
                                placeholder="Enter Quiz Name" required />
                        </div>

                        <div class="questions-section overflow-auto" style="max-height: 400px;">
                            <div v-for="(question, index) in quiz.questions" :key="index" class="card mb-4 p-3">
                                <h5>Question {{ index + 1 }}</h5>
                                <div class="input-box input-group mb-3">
                                    <div class="form-floating">
                                        <textarea style="resize:none;" class="form-control" v-model="question.text"
                                            id="questionText" placeholder="Enter Question" rows="3" required></textarea>
                                        <label for="questionText">Question {{ index + 1 }}</label>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="input-box input-group">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" v-model="question.options[0]"
                                                    placeholder="Option A" required />
                                                <label for="optionA">Option A</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-box input-group">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" v-model="question.options[1]"
                                                    placeholder="Option B" required />
                                                <label for="optionB">Option B</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <div class="input-box input-group">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" v-model="question.options[2]"
                                                    placeholder="Option C" required />
                                                <label for="optionC">Option C</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-box input-group">
                                            <div class="form-floating">
                                                <input type="text" class="form-control" v-model="question.options[3]"
                                                    placeholder="Option D" required />
                                                <label for="optionD">Option D</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="input-box input-group mb-2">
                                    <div class="form-floating">
                                        <select class="form-select" v-model="question.correctOption" id="correctOption"
                                            aria-label="Correct Option" required>
                                            <option v-for="(option, optIndex) in ['A', 'B', 'C', 'D']" :key="optIndex"
                                                :value="optIndex">
                                                {{ option }}
                                            </option>
                                        </select>
                                        <label for="correctOption">Correct Option</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-end">
                            <button type="button" class="btn btn-success me-2" @click="addQuestion">+ Add
                                Question</button>
                            <button type="button" class="btn btn-danger" @click="removeLastQuestion">- Remove Last
                                Question</button>
                        </div>
                        <div class="mt-3">
                            <button type="submit" class="btn btn-primary w-100">
                                {{ isEditing ? 'Update Quiz' : 'Create Quiz' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Second Div: Available Quizzes Section (lg: 5 cols) -->
            <div class="col-lg-5">
                <div class="quiz-list-section border p-3">
                    <h3>Available Quizzes for Students</h3>
                    <div class="overflow-auto" style="max-height: 575px;">
                        <div v-for="(quiz, index) in quizzes" :key="index" class="card mb-3">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <h5 class="card-title">{{ quiz.name }}</h5>
                                <div>
                                    <button class="btn btn-info me-2" @click="editQuiz(index)">Edit</button>
                                    <button class="btn btn-danger me-2" @click="deleteQuiz(index)">Delete</button>
                                    <button class="btn btn-secondary">View</button>
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
import { ref } from "vue";

export default {
    setup() {
        const quiz = ref({
            name: "",
            questions: [
                {
                    text: "",
                    options: ["", "", "", ""],
                    correctOption: 0, // A=0, B=1, C=2, D=3
                },
            ],
        });

        // Sample data with 4-5 quizzes and 10-20 questions each
        const quizzes = ref([
            {
                name: "General Knowledge Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Sample Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
            {
                name: "Science Quiz",
                questions: Array(15).fill(null).map((_, index) => ({
                    text: `Science Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 1,
                })),
            },
            {
                name: "History Quiz",
                questions: Array(12).fill(null).map((_, index) => ({
                    text: `History Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 2,
                })),
            },
            {
                name: "Math Quiz",
                questions: Array(20).fill(null).map((_, index) => ({
                    text: `Math Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 3,
                })),
            },
            {
                name: "Geography Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Geography Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
            {
                name: "Geography Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Geography Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
            {
                name: "Geography Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Geography Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
            {
                name: "Geography Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Geography Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
            {
                name: "Geography Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    text: `Geography Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctOption: 0,
                })),
            },
        ]);

        const isEditing = ref(false);
        let editingIndex = null;

        const addQuestion = () => {
            quiz.value.questions.push({
                text: "",
                options: ["", "", "", ""],
                correctOption: 0,
            });
        };

        const removeLastQuestion = () => {
            if (quiz.value.questions.length > 1) {
                quiz.value.questions.pop();
            }
        };

        const createOrUpdateQuiz = () => {
            // Perform HTML form validation check
            const form = document.querySelector('form');
            if (!form.checkValidity()) {
                form.reportValidity(); // Show native validation messages
                return;
            }

            // Additional custom validation: Ensure all options are filled
            for (const [index, question] of quiz.value.questions.entries()) {
                if (question.options.some(option => !option.trim())) {
                    alert(`All options must be filled for Question ${index + 1}`);
                    return;
                }
            }

            // If editing, update the existing quiz
            if (isEditing.value && editingIndex !== null) {
                quizzes.value[editingIndex] = { ...quiz.value };
                isEditing.value = false;
                editingIndex = null;
            } else {
                // Create a new quiz
                quizzes.value.push({ ...quiz.value });
            }

            resetQuizForm();
        };



        const editQuiz = (index) => {
            quiz.value = { ...quizzes.value[index] };
            isEditing.value = true;
            editingIndex = index;
        };

        const deleteQuiz = (index) => {
            quizzes.value.splice(index, 1);
        };

        const resetQuizForm = () => {
            quiz.value = {
                name: "",
                questions: [
                    {
                        text: "",
                        options: ["", "", "", ""],
                        correctOption: 0,
                    },
                ],
            };
        };

        return {
            quiz,
            quizzes,
            addQuestion,
            removeLastQuestion,
            createOrUpdateQuiz,
            editQuiz,
            deleteQuiz,
            isEditing,
        };
    },
};
</script>

<style>
.quiz-creation-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.quiz-list-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
}

.card {
    background-color: #ffffff;
}
</style>
