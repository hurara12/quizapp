<template>
    <div class="container mt-5">
        <!-- Search and View Mode -->
        <div class="d-flex justify-content-between mb-3">
            <input type="text" class="form-control w-50" placeholder="Search..." v-model="searchQuery" />
            <div>
                <label for="view" class="me-2">View As:</label>
                <select id="view" v-model="viewMode" class="form-select d-inline w-auto">
                    <option value="student">View by Student</option>
                    <option value="quiz">View by Quiz</option>
                </select>
            </div>
        </div>

        <!-- Cards -->
        <div class="row">
            <transition-group name="fade-slide" tag="div" class="d-flex flex-wrap">
                <div v-for="(item, index) in paginatedData" :key="index" class="col-12 col-md-6 col-lg-4 p-4">
                    <div class="card custom-card user-card p-3" :style="{ height: '400px' }">
                        <div class="card-body text-center">
                            <template v-if="viewMode === 'student'">
                                <h6 class="card-subtitle mb-2 text-muted">User Information</h6>
                                <h5 class="card-title">{{ item.name }}</h5>
                                <p class="card-text">{{ item.email }}</p>
                                <p>Attempted Quizzes:</p>
                                <ul class="list-unstyled">
                                    <li v-for="(quiz, idx) in item.quizzes.slice(0, 3)" :key="idx">
                                        <strong>{{ quiz.name }}</strong> - {{ quiz.marks }} marks
                                    </li>
                                </ul>
                                <button @click="viewsolo" class="btn btn-outline-primary w-100">Click for More
                                    Details</button>
                            </template>
                            <template v-else>
                                <h6 class="card-title">{{ item.quizName }}</h6>
                                <p>Attempted Students:</p>
                                <div style="max-height: 200px; overflow-y: auto;">
                                    <ul class="list-unstyled">
                                        <li v-for="(student, idx) in item.students.slice(0, 8)" :key="idx">
                                            {{ student.name }}: {{ student.marks }}/100
                                        </li>
                                    </ul>
                                </div>
                                <button @click="viewsolo" class="btn btn-outline-primary w-100">Click for More
                                    Details</button>
                            </template>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>

        <!-- Pagination Component -->
        <pagination-component :currentPage="currentPage" :totalPages="totalPages" @updatePage="goToPage" />
    </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import PaginationComponent from "./Pagination.vue";

export default {
    components: {
        PaginationComponent,
    },
    setup() {
        const searchQuery = ref("");
        const viewMode = ref("student");
        const currentPage = ref(1); // Tracks the current page
        const itemsPerPage = ref(3); // Number of items per page

        const router = useRouter();
        const students = ref([
            {
                name: "John Doe",
                email: "john@example.com",
                phone: "+49 258-627-6644",
                quizzes: [
                    { name: "Quiz 1", marks: 85 },
                    { name: "Quiz 2", marks: 75 },
                    { name: "Quiz 3", marks: 90 },
                    { name: "Quiz 4", marks: 65 },
                ],
            },
            {
                name: "john Smith",
                email: "jane@example.com",
                phone: "+49 158-437-1234",
                quizzes: [
                    { name: "Quiz 1", marks: 80 },
                    { name: "Quiz 2", marks: 85 },
                    { name: "Quiz 3", marks: 70 },
                    { name: "Quiz 4", marks: 60 },
                ],
            },
            {
                name: "john Smith",
                email: "jane@example.com",
                phone: "+49 158-437-1234",
                quizzes: [
                    { name: "Quiz 1", marks: 80 },
                    { name: "Quiz 2", marks: 85 },
                    { name: "Quiz 3", marks: 70 },
                    { name: "Quiz 4", marks: 60 },
                ],
            },
            {
                name: "john Smith",
                email: "jane@example.com",
                phone: "+49 158-437-1234",
                quizzes: [
                    { name: "Quiz 1", marks: 80 },
                    { name: "Quiz 2", marks: 85 },
                    { name: "Quiz 3", marks: 70 },
                    { name: "Quiz 4", marks: 60 },
                ],
            },
            {
                name: "Alice Johnson",
                email: "alice@example.com",
                phone: "+49 178-123-4567",
                quizzes: [
                    { name: "Quiz 1", marks: 95 },
                    { name: "Quiz 2", marks: 88 },
                    { name: "Quiz 3", marks: 92 },
                ],
            },
            {
                name: "Bob Williams",
                email: "bob@example.com",
                phone: "+49 188-567-8901",
                quizzes: [
                    { name: "Quiz 1", marks: 70 },
                    { name: "Quiz 2", marks: 65 },
                    { name: "Quiz 3", marks: 78 },
                ],
            },
            {
                name: "Chris Evans",
                email: "chris@example.com",
                phone: "+49 199-654-3210",
                quizzes: [
                    { name: "Quiz 1", marks: 90 },
                    { name: "Quiz 2", marks: 85 },
                    { name: "Quiz 3", marks: 95 },
                ],
            },
        ]);

        const quizzes = ref([
            {
                id: 1,
                quizName: "Quiz 1",
                students: [
                    { name: "John Doe", marks: 85 },
                    { name: "Jane Smith", marks: 80 },
                    { name: "Alice Johnson", marks: 95 },
                    { name: "Bob Williams", marks: 70 },
                    { name: "John Doe", marks: 85 },
                    { name: "Jane Smith", marks: 80 },
                    { name: "Alice Johnson", marks: 95 },
                    { name: "Bob Williams", marks: 70 },
                ],
            },
            {
                id: 2,
                quizName: "Quiz 2",
                students: [
                    { name: "John Doe", marks: 75 },
                    { name: "Jane Smith", marks: 85 },
                    { name: "Alice Johnson", marks: 88 },
                    { name: "Chris Evans", marks: 85 },
                ],
            },
        ]);

        const filteredData = computed(() => {
            let data = viewMode.value === "student" ? students.value : quizzes.value;
            if (searchQuery.value) {
                data = data.filter((item) =>
                    viewMode.value === "student"
                        ? item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                        : item.quizName.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            }
            return data;
        });

        // Pagination logic
        const paginatedData = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return filteredData.value.slice(start, end);
        });

        const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

        const goToPage = (page) => {
            currentPage.value = page;
        };

        const viewsolo = () => {
            router.push("/viewsoloresult");
        };

        return {
            searchQuery,
            viewMode,
            paginatedData,
            totalPages,
            currentPage,
            goToPage,
            viewsolo,
        };
    },
};
</script>

<style scoped>
.user-card {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: #f8f9fa;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    text-align: center;
    transition: transform 0.6s, opacity 0.6s;
    transform-style: preserve-3d;
}

.btn {
    margin-top: auto;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.6s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(100px);
    /* Slide from right */
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-100px);
    /* Slide to left */
}

.custom-card {
    background: linear-gradient(135deg, #ece9e6, #ffffff);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: black;
}

.custom-card:hover {
    transform: scale(1.03);
}
</style>
