<template>
    <div class="container mt-5">
        <div class="row">
            <!-- Left Side: Accepted Students -->
            <div class="col-md-8">
                <h3>Accepted Students</h3>
                <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
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
                            <tr v-for="(student, index) in acceptedStudents" :key="index">
                                <td>{{ student.firstName }}</td>
                                <td>{{ student.lastName }}</td>
                                <td>{{ student.email }}</td>
                                <td>{{ student.phone }}</td>
                                <td><a :href="student.cv" target="_blank" class="btn btn-info btn-sm">View CV</a></td>
                                <td>{{ student.assignedQuizzes.join(', ') }}</td>
                                <td>
                                    <input type="checkbox" @change="toggleQuizAssignment(student)" />
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
                <div class="card-container" style="max-height: 600px; overflow-y: auto;">
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
import { reactive, ref } from 'vue';

// Data for accepted students
const acceptedStudents = ref([
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        cv: '/path/to/cv/john_doe.pdf',
        assignedQuizzes: ['Quiz 1'],
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        cv: '/path/to/cv/jane_smith.pdf',
        assignedQuizzes: ['Quiz 2'],
    },
    // Add more students as needed
]);

// Data for pending students
const pendingStudents = ref([
    {
        firstName: 'Mark',
        lastName: 'Taylor',
        email: 'mark.taylor@example.com',
        phone: '555-123-4567',
        cv: '/path/to/cv/mark_taylor.pdf',
    },
    {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phone: '444-987-6543',
        cv: '/path/to/cv/alice_johnson.pdf',
    },
    // Add more pending students as needed
]);

// Data for available quizzes
const availableQuizzes = ref([
    { id: 1, title: 'Quiz 1' },
    { id: 2, title: 'Quiz 2' },
    { id: 3, title: 'Quiz 3' },
]);

// State management
const showAssignDiv = ref(false); // To show/hide the assign quiz div
const selectedStudents = ref([]); // List of selected students
const selectedQuiz = ref('');     // Selected quiz to be assigned

// Handle checkbox toggle for quiz assignment
const toggleQuizAssignment = (student) => {
    if (selectedStudents.value.includes(student)) {
        selectedStudents.value = selectedStudents.value.filter((s) => s !== student);
    } else {
        selectedStudents.value.push(student);
    }
    showAssignDiv.value = selectedStudents.value.length > 0;
};

// Assign the selected quiz to the selected students
const assignQuizToStudents = () => {
    selectedStudents.value.forEach((student) => {
        student.assignedQuizzes.push(selectedQuiz.value);
    });
    selectedStudents.value = [];
    showAssignDiv.value = false;
};

// Accept student and move from pending to accepted
const acceptStudent = (index) => {
    const acceptedStudent = pendingStudents.value.splice(index, 1)[0];
    acceptedStudents.value.push({ ...acceptedStudent, assignedQuizzes: [] });
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
