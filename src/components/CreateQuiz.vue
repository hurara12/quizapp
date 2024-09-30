<template>
    <div class="main-wrap">
        <div class="container mt-5">
            <Header title="Create and View Quiz" />

            <div class="row g-3 pt-5 main-content">
                <div class="col-lg-7 col-md-12">
                    <form @submit.prevent="createOrUpdateQuiz">
                        <div class="quiz-section border p-2">
                            <h3 class="text-muted text-center">Create Quiz</h3>
                            <div class="mb-2 d-flex align-items-center">
                                <label for="quizName" class="form-label me-2">Quiz Name</label>
                                <input type="text" class="form-control me-2" id="quizName" v-model="quiz.name"
                                    placeholder="Enter Quiz Name" :disabled="isQuizNameAdded" required
                                    style="flex: 1;" />
                                <button type="button" class="btn btn-info" @click="addQuiz"
                                    :disabled="isQuizNameAdded">Add Quiz</button>
                            </div>

                            <div class="quiz-section overflow-height">
                                <div v-for="(question, index) in quiz.questions" :key="index" class="card mb-4 p-3">
                                    <h5>Question {{ index + 1 }}</h5>
                                    <div class="input-box input-group mb-2">
                                        <div class="form-floating">
                                            <textarea style="resize:none;" class="form-control"
                                                v-model="question.question_text" id="questionText"
                                                placeholder="Enter Question" rows="3" required></textarea>
                                            <label for="questionText">Question {{ index + 1 }}</label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-2">
                                            <div class="input-box input-group">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control"
                                                        v-model="question.options[0]" placeholder="Option A" required />
                                                    <label for="optionA">Option A</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <div class="input-box input-group">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control"
                                                        v-model="question.options[1]" placeholder="Option B" required />
                                                    <label for="optionB">Option B</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-2">
                                            <div class="input-box input-group">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control"
                                                        v-model="question.options[2]" placeholder="Option C" required />
                                                    <label for="optionC">Option C</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <div class="input-box input-group">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control"
                                                        v-model="question.options[3]" placeholder="Option D" required />
                                                    <label for="optionD">Option D</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="input-box input-group mb-2">
                                        <div class="form-floating">
                                            <select class="form-select" v-model="question.correct_option"
                                                id="correct_option" aria-label="Correct Option" required>
                                                <option v-for="(option, optIndex) in question.options" :key="optIndex"
                                                    :value="option">
                                                    {{ option }}
                                                </option>
                                            </select>
                                            <label for="correct_option">Correct Option</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-end">
                                <button type="button" class="btn btn-success bg-gradient me-2" @click="addQuestion">+
                                    Add
                                    Question</button>
                                <button type="button" class="btn btn-danger bg-gradient" @click="removeLastQuestion">-
                                    Remove Last
                                    Question</button>
                            </div>
                            <div class="mt-2">
                                <button type="submit" class="btn btn-info w-100">
                                    {{ isEditing ? 'Update Quiz' : 'Create Quiz' }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="col-lg-5 col-md-12">
                    <div class="quiz-section border p-3">
                        <h4 class="text-muted text-center">Available Quizzes for Students</h4>
                        <div class=" overflow-auto" style="height: 535px;">
                            <div v-for="(quiz, index) in quizzes" :key="index" class="card mb-3">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                    <h5 class="card-title">{{ quiz.name }}</h5>
                                    <div>
                                        <button class="btn btn-outline-warning bg-gradient me-2"
                                            @click="editQuiz(index)">Edit</button>
                                        <button class="btn btn-outline-secondary me-2">View</button>
                                        <button class="btn btn-outline-danger bg-gradient"
                                            @click="deleteQuiz(index)">Delete</button>

                                    </div>
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
import Header from '@/components/HeaderAndLogout.vue'; // 
import { useStore } from 'vuex';

export default {
    components: {
        Header,
    },
    setup() {
        const isQuizNameAdded = ref(false);
        let quizid = ref('');
        const store = useStore();

        const quiz = ref({
            name: "",
            quiz_id: '',
            questions: [
                {
                    question_text: "",
                    options: ["", "", "", ""],
                    correct_option: '',
                },
            ],
        });
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        const now = new Date();

        const addQuiz = async () => {
            if (quiz.value.name.trim() === "") {
                alert("Quiz name is required");
                return;
            }
            isQuizNameAdded.value = true;
            const quizName = {
                title: quiz.value.name,  // Ensure correct concatenation
                scheduled_at: formatDate(now),
                expires_at: formatDate(now),
            }
            console.log("QQ ", quizName)
            try {
                const success = await store.dispatch('addQuiz', quizName);
                if (success) {
                    quiz.value.quiz_id = success; // Set the quiz ID received from the API
                    console.log('Quiz ID received: ', quiz.value.quiz_id);
                }
            } catch (error) {
                console.error('Error submitting profile:', error);
            }

        };
        const createQuizoApi = async () => {
            try {
                // Ensure 'quiz.value.questions' is defined and valid
                if (quiz.value.questions && quiz.value.questions.length > 0 && quiz.value.quiz_id) {
                    // Loop through all questions in the quiz
                    const quiz_id = quiz.value.quiz_id;
                    for (const question of quiz.value.questions) {
                        const { question_text, options, correct_option } = question;

                        const q = {
                            question_text,
                            options,
                            correct_option,
                            quiz_id // Use the quiz_id obtained from addQuiz
                        };

                        console.log("Question being added: ", q);

                        const success = await store.dispatch('addQuestion', q);

                        if (success) {
                            console.log('Question added successfully:', success);
                        } else {
                            console.warn('Failed to add question:', success);
                        }
                    }
                } else {
                    console.warn('No questions available to add or quiz ID is missing.');
                }
            } catch (error) {
                console.error('Error adding questions:', error);
            }
        };

        // const addQuestionToApi = async () => {
        //     try {
        //         // Ensure 'quiz.value.questions' and 'questions' are defined and valid
        //         if (quiz.value.questions && quiz.value.questions.length > 0 && quiz.value.quiz_id) {
        //             const { question_text,
        //                 options,
        //                 correct_option } = quiz.value.questions[quiz.value.questions.length - 1];
        //             const q = {
        //                 question_text,
        //                 options,
        //                 correct_option,
        //                 quiz_id: quiz.value.quiz_id // Use the quiz_id obtained from addQuiz
        //             };

        //             console.log("Question being added: ", q);

        //             const success = await store.dispatch('addQuestion', q);

        //             if (success) {
        //                 console.log('Question added successfully:', success);
        //             } else {
        //                 console.warn('Failed to add question:', success);
        //             }
        //         } else {
        //             console.warn('No questions available to add.');
        //         }
        //     } catch (error) {
        //         console.error('Error adding question:', error);
        //     }

        // };
        // Sample data i wll replace with backend
        const quizzes = ref([
            {
                name: "General Quiz",
                questions: Array(10).fill(null).map((_, index) => ({
                    question_text: `Sample Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct_option: 'Option A',
                })),
            },
            {
                name: "Science Quiz",
                questions: Array(15).fill(null).map((_, index) => ({
                    question_text: `Science Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct_option: 'Option B',
                })),
            },
            {
                name: "History Quiz",
                questions: Array(12).fill(null).map((_, index) => ({
                    question_text: `History Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct_option: 'Option C',
                })),
            },
            {
                name: "Math Quiz",
                questions: Array(20).fill(null).map((_, index) => ({
                    question_text: `Math Question ${index + 1}?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correct_option: 'Option D',
                })),
            }
        ]);

        const isEditing = ref(false);
        let editingIndex = null;

        const addQuestion = () => {
            //addQuestionToApi();
            quiz.value.questions.push({
                question_text: "",
                options: ["", "", "", ""],
                correct_option: '',
                quiz_id: '',
            });
        };

        const removeLastQuestion = () => {
            if (quiz.value.questions.length > 1) {
                quiz.value.questions.pop();
            }
        };

        const createOrUpdateQuiz = () => {
            const form = document.querySelector('form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            for (const [index, question] of quiz.value.questions.entries()) {
                if (question.options.some(option => !option.trim())) {
                    alert(`All options must be filled for Question ${index + 1}`);
                    return;
                }
            }

            if (isEditing.value && editingIndex !== null) {
                quizzes.value[editingIndex] = { ...quiz.value };
                isEditing.value = false;
                editingIndex = null;
            } else {
                createQuizoApi();
            }
            console.log(quiz.value);
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
                        correct_option: 'A',
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
            isQuizNameAdded,
            addQuiz,
            quizid,
        };
    },
};
</script>

<style>
.main-wrap {
    background-color: #fbe9d0;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 30px;
}

.quiz-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
}

.card {
    background-color: #ffffff;
}

.btn-red {
    background-color: #e64833;
}

.overflow-height {
    overflow: auto;
    height: 390px;
}
</style>
