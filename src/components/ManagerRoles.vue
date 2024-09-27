<template>
    <div class="container mt-5">
        <div class="row">
            <!-- Left Form -->
            <div class="col-md-4">
                <h3>{{ isEditing ? 'Edit Role' : 'Add Role' }}</h3>
                <form @submit.prevent="isEditing ? updateRole() : addRole()">
                    <!-- Name Field -->
                    <div class="form-floating mb-3">
                        <input v-model="formData.name" type="text" class="form-control" id="name"
                            placeholder="Enter Name" required />
                        <label for="name">Name</label>
                    </div>

                    <!-- Email Field -->
                    <div class="form-floating mb-3">
                        <input v-model="formData.email" type="email" class="form-control" id="email"
                            placeholder="Enter Email" required />
                        <label for="email">Email</label>
                    </div>

                    <!-- Role Field -->
                    <div class="form-floating mb-3">
                        <select v-model="formData.role" id="role" class="form-select" required>
                            <option value="manager">Manager</option>
                            <option value="supervisor">Supervisor</option>
                        </select>
                        <label for="role">Role</label>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary w-100">
                        {{ isEditing ? 'Update Role' : 'Add Role' }}
                    </button>
                </form>
            </div>

            <!-- Right Table -->
            <div class="col-md-8">
                <h3>Roles</h3>
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in users" :key="index">
                                <td>{{ user.name }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.role }}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm me-2" @click="editRole(index)">
                                        Edit
                                    </button>
                                    <button class="btn btn-danger btn-sm" @click="deleteRole(index)">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios'; // This will help later for API
import { useStore } from 'vuex';

const store = useStore();
// Form data object
const formData = reactive({
    name: '',
    email: '',
    role: 'manager',
});

// Vuex users state (or can be fetched later)
const users = ref([]);

// Edit control flags
const isEditing = ref(false);
const editIndex = ref(null);

// Add new role
const addRole = async () => {
    try {
        const success = await store.dispatch('addRole', formData);
        if (success) {
            users.value.push({ ...formData }); // Add the new role to users
            resetForm(); // Reset the form after adding
        }
    } catch (error) {
        console.error('Error adding role:', error);
    }
};

// Edit existing role
const editRole = (index) => {
    isEditing.value = true;
    editIndex.value = index;
    Object.assign(formData, users.value[index]);
};

// Update role
const updateRole = () => {
    Object.assign(users.value[editIndex.value], { ...formData });
    isEditing.value = false;
    resetForm();
};

// Delete role
const deleteRole = (index) => {
    users.value.splice(index, 1);
};

// Reset form
const resetForm = () => {
    formData.name = '';
    formData.email = '';
    formData.role = 'manager';
    isEditing.value = false;
};

// On mounted (can later integrate this with Vuex or API call)
onMounted(async () => {
    try {
        const response = await axios.get('/db.json');
        users.value = response.data.roles || [];
    } catch (error) {
        console.error('Error loading roles:', error);
    }
});
</script>

<style scoped>
h3 {
    margin-bottom: 20px;
}

.form-floating label {
    font-weight: 500;
}

.table {
    margin-top: 20px;
}

.me-2 {
    margin-right: 0.5rem;
}

.table th,
.table td {
    vertical-align: middle;
}

@media (max-width: 768px) {

    .col-md-4,
    .col-md-8 {
        flex: 100%;
        max-width: 100%;
    }
}
</style>
