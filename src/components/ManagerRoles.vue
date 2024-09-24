<template>
    <div class="container mt-5">
        <div class="row">
            <!-- Left Form -->
            <div class="col-md-4">
                <h3>{{ isEditing ? 'Edit Role' : 'Add Role' }}</h3>
                <form @submit.prevent="isEditing ? updateRole() : addRole()">
                    <div class="mb-3">
                        <label for="firstName" class="form-label">First Name</label>
                        <input v-model="formData.firstName" type="text" class="form-control" id="firstName" required />
                    </div>

                    <div class="mb-3">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input v-model="formData.lastName" type="text" class="form-control" id="lastName" required />
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="formData.email" type="email" class="form-control" id="email" required />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input v-model="formData.password" type="password" class="form-control" id="password"
                            required />
                    </div>

                    <div class="mb-3">
                        <label for="role" class="form-label">Role</label>
                        <select v-model="formData.role" id="role" class="form-select" required>
                            <option value="manager">Manager</option>
                            <option value="supervisor">Supervisor</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update Role' : 'Add Role' }}</button>
                </form>
            </div>

            <!-- Right Table -->
            <div class="col-md-8">
                <h3>Roles</h3>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user, index) in users" :key="index">
                            <td>{{ user.firstName }}</td>
                            <td>{{ user.lastName }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.role }}</td>
                            <td>
                                <button class="btn btn-warning btn-sm me-2" @click="editRole(index)">Edit</button>
                                <button class="btn btn-danger btn-sm" @click="deleteRole(index)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

// Initial form data
const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'manager',
});

// Flags
const users = ref([]);
const isEditing = ref(false);
const editIndex = ref(null);

// Add role function
const addRole = async () => {
    users.value.push({ ...formData });
    resetForm();
};

// Edit role function
const editRole = (index) => {
    isEditing.value = true;
    editIndex.value = index;
    Object.assign(formData, users.value[index]);
};

// Update role function
const updateRole = () => {
    Object.assign(users.value[editIndex.value], { ...formData });
    isEditing.value = false;
    resetForm();
};

// Delete role function
const deleteRole = (index) => {
    users.value.splice(index, 1);
};

// Reset form
const resetForm = () => {
    formData.firstName = '';
    formData.lastName = '';
    formData.email = '';
    formData.password = '';
    formData.role = 'manager';
    isEditing.value = false;
};

// Fetch initial data from db.json (useful for integration)
onMounted(async () => {
    try {
        const response = await axios.get('/db.json');
        users.value = response.data.managers;
    } catch (error) {
        console.error('Error loading users:', error);
    }
});
</script>
<style scoped>
h3 {
    margin-bottom: 20px;
}

form .form-label {
    font-weight: 600;
}

button {
    width: 100%;
}

.table {
    margin-top: 20px;
}

.table th,
.table td {
    vertical-align: middle;
}

.me-2 {
    margin-right: 0.5rem;
}
</style>
