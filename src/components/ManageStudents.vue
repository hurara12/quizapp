<template>
    <div class="container mt-5">
        <div class="row">
            <!-- Left Side: Accepted Students -->
            <div class="col-md-8">
                <h3>Accepted Students</h3>

                <!-- Search Bar -->
                <input type="text" v-model="searchQuery" class="form-control mb-3"
                    placeholder="Search by Name, Phone, Email, or Quizzes" />

                <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone No</th>
                                <th>View CV</th>
                                <th>Assigned Quizzes</th>
                                <th>Assign Quiz</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, index) in filteredStudents" :key="index">
                                <td>{{ student.firstName }}</td>
                                <td>{{ student.lastName }}</td>
                                <td>{{ student.email }}</td>
                                <td>{{ student.phone }}</td>
                                <td><a :href="student.cv" target="_blank" class="btn btn-info btn-sm">View CV</a></td>
                                <td>{{ student.assignedQuizzes.join(', ') }}</td>
                                <td>
                                    <input type="checkbox" :disabled="isQuizAlreadyAssigned(student)"
                                        @change="toggleQuizAssignment(student)" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Assign Quiz Div -->
                <div v-if="showAssignDiv" class="mt-4">
                    <label for="availableQuizzes" class="form-label">Available Quizzes</label>
                    <select v-model="selectedQuiz" id="availableQuizzes" class="form-select mb-3">
                        <option v-for="quiz in availableQuizzes" :key="quiz.id" :value="quiz.title">
                            {{ quiz.title }}
                        </option>
                    </select>
                    <button class="btn btn-primary" @click="assignQuizToStudents">Assign Quiz to Selected
                        Students</button>
                </div>
            </div>

            <!-- Right Side: Pending Students -->
            <div class="col-md-4">
                <h3>Pending Students</h3>
                <div class="card-container" style="max-height: 300px; overflow-y: auto;">
                    <div class="card mb-3" v-for="(student, index) in pendingStudents" :key="index">
                        <div class="card-body">
                            <h5 class="card-title">{{ student.firstName }} {{ student.lastName }}</h5>
                            <p class="card-text"><strong>Email:</strong> {{ student.email }}</p>
                            <p class="card-text"><strong>Phone No:</strong> {{ student.phone }}</p>
                            <p class="card-text"><strong>Status:</strong> Pending</p>
                            <a :href="student.cv" target="_blank" class="btn btn-info btn-sm mb-2">View CV</a>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-success" @click="acceptStudent(index)">Accept</button>
                                <button class="btn btn-danger" @click="rejectStudent(index)">Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Local state variables
const searchQuery = ref('');
const selectedStudents = ref([]);
const selectedQuiz = ref('');
const showAssignDiv = ref(false);

// Fetch accepted students and pending students from Vuex store
const acceptedStudents = computed(() => store.state.acceptedStudents);
console.log(acceptedStudents);
const pendingStudents = computed(() => store.state.pendingStudents);
const availableQuizzes = computed(() => store.state.availableQuizzes);

// Filter students based on search query
const filteredStudents = computed(() => {
    return acceptedStudents.value.filter((student) => {
        const searchString = `${student.firstName} ${student.lastName} ${student.email} ${student.phone} ${student.assignedQuizzes.join(', ')}`.toLowerCase();
        return searchString.includes(searchQuery.value.toLowerCase());
    });
});

// Toggle quiz assignment
const toggleQuizAssignment = (student) => {
    if (selectedStudents.value.includes(student)) {
        selectedStudents.value = selectedStudents.value.filter((s) => s !== student);
    } else {
        selectedStudents.value.push(student);
    }
    showAssignDiv.value = selectedStudents.value.length > 0;
};

// Check if a quiz is already assigned
const isQuizAlreadyAssigned = (student) => {
    return student.assignedQuizzes.includes(selectedQuiz.value);
};

// Assign the selected quiz to selected students
const assignQuizToStudents = async () => {
    try {
        await store.dispatch('assignQuiz', {
            students: selectedStudents.value,
            quiz: selectedQuiz.value,
        });
        // Clear selected students and hide the assignment div
        selectedStudents.value = [];
        showAssignDiv.value = false;
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => (checkbox.checked = false));
    } catch (error) {
        console.error('Failed to assign quiz:', error);
    }
};

// Accept student and move from pending to accepted
const acceptStudent = (index) => {
    const acceptedStudent = pendingStudents.value.splice(index, 1)[0];
    store.commit('acceptStudent', acceptedStudent);
};

// Reject student and remove from pending list
const rejectStudent = (index) => {
    pendingStudents.value.splice(index, 1);
};
</script>
<style scoped>
h3 {
    margin-bottom: 20px;
}

.table-responsive {
    border: 1px solid #dee2e6;
}

.table th,
.table td {
    vertical-align: middle;
}

.card-container {
    max-height: 300px;
    overflow-y: auto;
}

.card {
    border: 1px solid #dee2e6;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 1.25rem;
}

.btn {
    width: 100%;
}

.mb-3 {
    margin-bottom: 1rem;
}
</style>
