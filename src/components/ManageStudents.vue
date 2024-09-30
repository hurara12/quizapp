<template>

    <div class="main-wrap">
        <div class="container mt-5">
            <Header title="Manage Student" />
            <div class="row">
                <div class="col-md-8 pe-3">
                    <div class="box-section">
                        <h3 class="text-center text-muted">Students</h3>

                        <div class="d-flex mb-3">
                            <input type="text" v-model="searchQuery" class="form-control me-2"
                                placeholder="Search by Name, Phone, Email, or Quizzes" />
                            <select v-model="filterStatus" class="form-select"
                                :class="{ 'text-success': filterStatus === 'aceepted', 'text-danger': filterStatus === 'rejected' }">
                                <option value="accepted" class="text-success">Accepted</option>
                                <option value="rejected" class="text-danger">Rejected</option>
                            </select>

                        </div>

                        <div class="table-responsive" style="height: 450px; overflow-y: auto;">
                            <table class="table table-hover">
                                <thead style="position: sticky; top: 0; z-index: 1; background-color: #fff;">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>View CV</th>
                                        <th>Status</th>
                                        <th v-if="filterStatus === 'accepted'">Assigned</th>
                                        <th v-if="filterStatus === 'accepted'">Assign</th>
                                        <th v-if="filterStatus === 'rejected'">Rejected At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(student, index) in filteredStudents" :key="index">
                                        <td class="firstCapital">{{ student.name }}</td>
                                        <td>{{ student.email }}</td>
                                        <td><a :href="student.cv_file" target="_blank"
                                                class="btn btn-outline-info btn-sm">View
                                                CV</a>
                                        </td>
                                        <td class="firstCapital"
                                            :class="{ 'text-success': filterStatus === 'accepted', 'text-danger': filterStatus === 'rejected' }">
                                            {{ student.status }}</td>
                                        <td v-if="filterStatus === 'accepted'">{{ student.created_at }}</td>
                                        <td v-if="filterStatus === 'accepted'">
                                            <input type="checkbox"
                                                :disabled="isQuizAlreadyAssigned(student) || student.status === 'rejected'"
                                                @change="toggleQuizAssignment(student)" />
                                        </td>

                                        <td class="firstCapital" v-if="filterStatus === 'rejected'">{{
                                            student.updated_at }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

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
                                <input type="datetime-local" v-model="startDateTime" id="startDateTime"
                                    class="form-control" :min="minDateTime" :max="maxStartDateTime" required />
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
                </div>

                <div class="col-md-4 box-section">
                    <h3 class="text-center text-muted">Pending Students</h3>
                    <div class="card-container"
                        :style="{ maxHeight: showAssignDiv ? '840px' : '500px', overflowY: 'auto' }">
                        <div class="card mb-3"
                            v-for="(student, index) in pendingStudents.filter(student => student.status === 'pending')"
                            :key="index">
                            <div class="card-body">
                                <h5 class="card-title firstCapital"><strong>Name:</strong> {{ student.name }}</h5>
                                <p class="card-text"><strong>Email:</strong> {{ student.email }}</p>
                                <p class="card-text">
                                    <strong>Status: </strong>
                                    <span class="text-warning firstCapital">{{ student.status }}</span>
                                </p>
                                <a :href="student.cv_file" target="_blank" class="btn btn-outline-info btn-sm mb-2">View
                                    CV</a>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-success me-2" :disabled="loadingComp[student.id]"
                                        @click="acceptStudent(student.id)">Accept
                                        <font-awesome-icon v-if="loadingComp[student.id]"
                                            :icon="['fas', 'circle-notch']" class="fa-lg fa-spin" style="color: white;">
                                        </font-awesome-icon>
                                    </button>
                                    <button class="btn btn-danger" :disabled="loadingCompReject[student.id]"
                                        @click="rejectStudent(student.id)">Reject
                                        <font-awesome-icon v-if="loadingCompReject[student.id]"
                                            :icon="['fas', 'circle-notch']" class="fa-lg fa-spin" style="color: white;">
                                        </font-awesome-icon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Header from '@/components/HeaderAndLogout.vue'; // 

const store = useStore();
let loadingComp = ref({});
let loadingCompReject = ref({});

onMounted(() => {
    store.dispatch('fetchPendingStudents');
});


const pendingStudents = computed(() => store.getters.pendingStudents);
// const pendingStudents = computed(() => [
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },
//     { id: 1, name: 'Alice Smith', email: 'alice@example.com', status: 'pending', cv_file: 'https://example.com/cv1.pdf' },
//     { id: 2, name: 'Bob Johnson', email: 'bob@example.com', status: 'accepted', cv_file: 'https://example.com/cv2.pdf' },
//     { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', status: 'rejected', cv_file: 'https://example.com/cv3.pdf' },

// ]);

const availableQuizzes = ref([
    { id: 1, title: 'Quiz 1' },
    { id: 2, title: 'Quiz 2' },
    { id: 3, title: 'Quiz 3' },
]);

const selectedStudents = ref([]);
const selectedQuiz = ref('');
const showAssignDiv = ref(false);
const searchQuery = ref('');
const filterStatus = ref('accepted');

const startDateTime = ref('');
const endDateTime = ref('');

const toggleQuizAssignment = (student) => {
    if (selectedStudents.value.includes(student)) {
        selectedStudents.value = selectedStudents.value.filter((s) => s !== student);
    } else {
        selectedStudents.value.push(student);
    }
    showAssignDiv.value = selectedStudents.value.length > 0;
};

const minDateTime = ref(new Date().toISOString().slice(0, 16));

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
const acceptStudent = async (id) => {
    console.log(id);
    loadingComp.value[id] = true;
    // store.dispatch('acceptStudent', email);
    // const acceptedStudent = pendingStudents.value.splice(index, 1)[0];
    // acceptedStudents.value.push({ ...acceptedStudent, assignedQuizzes: [], status: 'accepted' });
    try {
        const success = await store.dispatch('acceptStudent', id);
        if (success) {
            console.log(success)
            await store.dispatch('fetchPendingStudents');
        }
    } catch (error) {
        console.error('Error submitting profile:', error);
    } finally {
        loadingComp.value[id] = false;
    }
};
const rejectStudent = async (id) => {
    console.log(id);
    loadingCompReject.value[id] = true;
    // store.dispatch('acceptStudent', email);
    // const acceptedStudent = pendingStudents.value.splice(index, 1)[0];
    // acceptedStudents.value.push({ ...acceptedStudent, assignedQuizzes: [], status: 'accepted' });
    try {
        const success = await store.dispatch('rejectStudent', id);
        if (success) {
            console.log(success)
            await store.dispatch('fetchPendingStudents');
        }
    } catch (error) {
        console.error('Error submitting profile:', error);
    } finally {
        loadingCompReject.value[id] = false;
    }
};

// Reject student and move to rejected list
// Reject student and move to rejected list


// Filter students based on search query and status
const filteredStudents = computed(() => {
    return pendingStudents.value.filter(student => {
        const matchesQuery = student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
            || student.status.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchesQuery && student.status === filterStatus.value;
    });
});

// Check if the quiz is already assigned to the student
const isQuizAlreadyAssigned = (student) => {
    return false;
};

</script>

<style scoped>
.main-wrap {
    background-color: #fbe9d0;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 80px;
}

h3 {
    margin-bottom: 20px;
}

.table-responsive {
    border: 1px solid #dee2e6;
}

.box-section {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
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

.firstCapital {
    text-transform: capitalize;
}
</style>
