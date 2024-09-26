<template>
    <!-- // rejected ka time ni a raha. or rejected mn bi assign quiz dikha raha hy  -->
    <div class="container mt-5">
        <div class="row">
            <!-- Left Side: Accepted and Rejected Students -->
            <div class="col-md-8">
                <h3>Students</h3>

                <!-- Search Bar and Dropdown Filter -->
                <div class="d-flex mb-3">
                    <input type="text" v-model="searchQuery" class="form-control me-2"
                        placeholder="Search by Name, Phone, Email, or Quizzes" />
                    <select v-model="filterStatus" class="form-select">
                        <option value="accepted" class="text-success">Accepted</option>
                        <option value="rejected" class="text-danger">Rejected</option>
                    </select>
                </div>

                <div class="table-responsive" style="max-height: 600px; overflow-y: auto;">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone No</th>
                                <th>View CV</th>
                                <th v-if="filterStatus === 'accepted'">Assigned</th>
                                <th v-if="filterStatus === 'accepted'">Assign</th>
                                <th v-if="filterStatus === 'rejected'">Status</th>
                                <th v-if="filterStatus === 'rejected'">Rejected At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, index) in filteredStudents" :key="index">
                                <td>{{ student.firstName }}</td>
                                <td>{{ student.lastName }}</td>
                                <td>{{ student.email }}</td>
                                <td>{{ student.phone }}</td>
                                <td><a :href="student.cv" target="_blank" class="btn btn-info btn-sm">View CV</a></td>
                                <td v-if="filterStatus === 'accepted'">{{ student.assignedQuizzes.join(', ') }}</td>
                                <td v-if="filterStatus === 'accepted'">
                                    <input type="checkbox"
                                        :disabled="isQuizAlreadyAssigned(student) || student.status === 'rejected'"
                                        @change="toggleQuizAssignment(student)" />
                                </td>
                                <td v-if="filterStatus === 'rejected'">{{ student.status }}</td>
                                <td v-if="filterStatus === 'rejected'">{{ student.rejectedAt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Assign Quiz Div -->
                <div v-if="showAssignDiv && filterStatus === 'accepted'" class="my-4">
                    <label for="availableQuizzes" class="form-label">Available Quizzes</label>
                    <select v-model="selectedQuiz" id="availableQuizzes" class="form-select mb-3" required>
                        <option value="" disabled>Select a Quiz</option> <!-- Default option -->
                        <option v-for="quiz in availableQuizzes" :key="quiz.id" :value="quiz.title">
                            {{ quiz.title }}
                        </option>
                    </select>

                    <div class="mb-3">
                        <label for="startDateTime" class="form-label">Quiz Start Date & Time</label>
                        <input type="datetime-local" v-model="startDateTime" id="startDateTime" class="form-control"
                            :min="minDateTime" :max="maxStartDateTime" required />
                    </div>

                    <div class="mb-3">
                        <label for="endDateTime" class="form-label">Quiz End Date & Time</label>
                        <input type="datetime-local" v-model="endDateTime" id="endDateTime" class="form-control"
                            :min="startDateTime || minDateTime" :max="maxEndDateTime" required />
                    </div>

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
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';

// Sample Data
const acceptedStudents = ref([
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '987-654-3210', cv: '/path/to/cv/jane_smith.pdf', assignedQuizzes: ['Quiz 2'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'Bob', lastName: 'Brown', email: 'bob.brown@example.com', phone: '111-222-3333', cv: '/path/to/cv/bob_brown.pdf', assignedQuizzes: [], status: 'rejected', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'Mary', lastName: 'Jones', email: 'mary.jones@example.com', phone: '444-555-6666', cv: '/path/to/cv/mary_jones.pdf', assignedQuizzes: [], status: 'rejected', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'Mary', lastName: 'Jones', email: 'mary.jones@example.com', phone: '444-555-6666', cv: '/path/to/cv/mary_jones.pdf', assignedQuizzes: [], status: 'rejected', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890', cv: '/path/to/cv/john_doe.pdf', assignedQuizzes: ['Quiz 1'], status: 'accepted', rejectedAt: new Date().toLocaleDateString() },


]);

const pendingStudents = ref([
    { firstName: 'Mark', lastName: 'Taylor', email: 'mark.taylor@example.com', phone: '555-123-4567', cv: '/path/to/cv/mark_taylor.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '444-987-6543', cv: '/path/to/cv/alice_johnson.pdf' },

]);

const availableQuizzes = ref([
    { id: 1, title: 'Quiz 1' },
    { id: 2, title: 'Quiz 2' },
    { id: 3, title: 'Quiz 3' },
]);

const selectedStudents = ref([]);
const selectedQuiz = ref('');
const showAssignDiv = ref(false);
const searchQuery = ref('');
const filterStatus = ref('accepted'); // Filter for accepted/rejected students

const startDateTime = ref('');
const endDateTime = ref('');

// Toggle student selection for quiz assignment
const toggleQuizAssignment = (student) => {
    if (selectedStudents.value.includes(student)) {
        selectedStudents.value = selectedStudents.value.filter((s) => s !== student);
    } else {
        selectedStudents.value.push(student);
    }
    showAssignDiv.value = selectedStudents.value.length > 0;
};
// Minimum allowed date/time (now or later)
const minDateTime = ref(new Date().toISOString().slice(0, 16)); // ISO 8601 format for 'yyyy-MM-ddTHH:mm'
// Maximum start date-time (30 days from today)
const today = new Date();
const maxStartDate = new Date(today);
maxStartDate.setDate(today.getDate() + 30);
const maxStartDateTime = ref(maxStartDate.toISOString().slice(0, 16)); // Start date limit: 30 days from today

// Maximum end date-time (dynamically set based on start date)
const maxEndDateTime = ref('');
// Watch the startDateTime value and calculate the max allowed endDateTime (30 days from start)
watch(startDateTime, (newStart) => {
    if (newStart) {
        const start = new Date(newStart);

        // Maximum end date is 30 days after start date, but no more than 60 days from today
        const maxEndFromStart = new Date(start);
        maxEndFromStart.setDate(start.getDate() + 30);

        const maxEndFromToday = new Date(today);
        maxEndFromToday.setDate(today.getDate() + 60); // Maximum end date is 60 days from today

        // Set the maxEndDateTime to the earlier of the two (30 days from start or 60 days from today)
        const maxAllowedEnd = maxEndFromStart > maxEndFromToday ? maxEndFromToday : maxEndFromStart;
        maxEndDateTime.value = maxAllowedEnd.toISOString().slice(0, 16); // Format as 'yyyy-MM-ddTHH:mm'
    }
});


// Assign quiz to selected students
const assignQuizToStudents = () => {
    // Validate required fields
    if (!selectedQuiz.value) {
        alert('Please select a quiz.');
        return;
    }

    if (!startDateTime.value) {
        alert('Please select a start date and time.');
        return;
    }

    if (!endDateTime.value) {
        alert('Please select an end date and time.');
        return;
    }

    // Ensure end time is after start time and within the limits
    if (new Date(startDateTime.value) >= new Date(endDateTime.value)) {
        alert('End time must be later than the start time.');
        return;
    }

    // Prepare the data to send to the backend
    const assignmentData = {
        quizTitle: selectedQuiz.value,
        startDateTime: startDateTime.value,
        endDateTime: endDateTime.value,
    };

    console.log('Assignment data:', assignmentData);

    // Perform backend action (with Axios, for example)
    // axios.post('/assign-quiz', assignmentData);
    // Perform backend action (with Axios, for example)
    // axios.post('/assign-quiz', assignmentData);
    selectedStudents.value.forEach((student) => {
        student.assignedQuizzes.push(selectedQuiz.value);
    });
    selectedStudents.value = [];
    showAssignDiv.value = false;
};

// Accept student and move to accepted list
const acceptStudent = (index) => {
    const acceptedStudent = pendingStudents.value.splice(index, 1)[0];
    acceptedStudents.value.push({ ...acceptedStudent, assignedQuizzes: [], status: 'accepted' });
};

// Reject student and move to rejected list
// Reject student and move to rejected list
const rejectStudent = (index) => {
    const rejectedStudent = pendingStudents.value.splice(index, 1)[0];
    rejectedStudents.value.push({ ...rejectedStudent, assignedQuizzes: [], status: 'rejected', rejectedAt: new Date().toLocaleDateString() });
};


// Filter students based on search query and status
const filteredStudents = computed(() => {
    return acceptedStudents.value.filter(student => {
        const matchesQuery = student.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.lastName.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.phone.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.assignedQuizzes.join(', ').toLowerCase().includes(searchQuery.value.toLowerCase());

        return matchesQuery && student.status === filterStatus.value;
    });
});


// Check if the quiz is already assigned to the student
const isQuizAlreadyAssigned = (student) => {
    return student.assignedQuizzes.includes(selectedQuiz.value);
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
