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
                                <option value="" disabled>Select a Quiz</option>
                                <option v-for="quiz in availableQuizzesList" :key="quiz.id" :value="quiz.id">
                                    {{ quiz.title }}
                                </option>
                            </select>



                            <div class="mb-3">
                                <label for="startDate" class="form-label">Quiz Start Date</label>
                                <input type="date" v-model="startDate" id="startDate" class="form-control"
                                    :min="minDate" :max="maxStartDate" required />
                            </div>

                            <div class="mb-3">
                                <label for="endDate" class="form-label">Quiz End Date</label>
                                <input type="date" v-model="endDate" id="endDate" class="form-control"
                                    :min="startDate || minDate" :max="maxEndDate" required />
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

onMounted(async () => {
    store.dispatch('fetchPendingStudents');
    try {
        await store.dispatch('fetchQuizzes'); // Ensure fetching completes
        availableQuizzes(); // Populate availableQuizzesList after fetch
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
});



const pendingStudents = computed(() => store.getters.pendingStudents);
const quizList = computed(() => store.getters.quizesData);
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

const availableQuizzesList = ref([]); // This will store available quizzes

const availableQuizzes = () => {
    console.log("Available Quizzes Triggered");
    if (quizList.value && quizList.value.length > 0) {
        // Map only the 'id' and 'title' from quizList
        console.log("Quizzes: ", quizList.value);
        availableQuizzesList.value = quizList.value.map(quiz => ({
            id: quiz.id,
            title: quiz.title,
        }));
    }
};


const selectedStudents = ref([]);
const selectedQuiz = ref('');
const showAssignDiv = ref(false);
const searchQuery = ref('');
const filterStatus = ref('accepted');


const toggleQuizAssignment = (student) => {
    if (selectedStudents.value.includes(student)) {
        selectedStudents.value = selectedStudents.value.filter((s) => s !== student);
    } else {
        selectedStudents.value.push(student);
    }
    showAssignDiv.value = selectedStudents.value.length > 0;
};

// Minimum date: today's date
const minDate = ref(new Date().toISOString().slice(0, 10));

// Maximum start date: 30 days from today
const today = new Date();
const maxStartDateValue = new Date(today);
maxStartDateValue.setDate(today.getDate() + 30);
const maxStartDate = ref(maxStartDateValue.toISOString().slice(0, 10)); // Start date limit: 30 days from today

// Maximum end date (dynamically set based on start date)
const maxEndDate = ref('');

// Reactive properties for start and end dates
const startDate = ref('');
const endDate = ref('');

// Watch the startDate value and calculate the max allowed endDate (30 days from start)
watch(startDate, (newStart) => {
    if (newStart) {
        const start = new Date(newStart);

        // Maximum end date is 30 days after start date
        const maxEndFromStart = new Date(start);
        maxEndFromStart.setDate(start.getDate() + 30);

        const maxEndFromToday = new Date(today);
        maxEndFromToday.setDate(today.getDate() + 60); // Maximum end date is 60 days from today

        // Set the maxEndDate to the earlier of the two (30 days from start or 60 days from today)
        const maxAllowedEnd = maxEndFromStart > maxEndFromToday ? maxEndFromToday : maxEndFromStart;
        maxEndDate.value = maxAllowedEnd.toISOString().slice(0, 10); // Format as 'yyyy-MM-dd'
    }
});
// Assign quiz to selected students
const assignQuizToStudents = async () => {
    // Validate required fields
    if (!selectedQuiz.value) {
        alert('Please select a quiz to assign.');
        return;
    }
    if (!startDate.value || !endDate.value) {
        alert('Please select valid start and end dates.');
        return;
    }
    console.log('sel ', selectedQuiz.value)



    for (const currStudentId of selectedStudents.value) {

        const assignmentDetails = {
            quiz_id: selectedQuiz.value,
            student_id: currStudentId.id,
            assigned_at: startDate.value,
            due_at: endDate.value,
            status: "assigned"
        };

        console.log('Assigning quiz to students:', assignmentDetails);


        const success = await store.dispatch('assignQuiz', assignmentDetails);

        if (success) {
            console.log('successfully:', success);

        } else {
            console.warn('Failed', success);
        }
    }
    console.log("testing")

    // Clear selected students and reset fields
    selectedStudents.value = [];
    selectedQuiz.value = '';
    startDate.value = '';
    endDate.value = '';
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
        const success = await store.dispatch('acceptAndReject', { id, action: 'accept' });
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
        const success = await store.dispatch('acceptAndReject', { id, action: 'reject' });
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
