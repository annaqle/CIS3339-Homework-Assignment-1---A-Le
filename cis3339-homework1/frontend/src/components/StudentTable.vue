<script setup>
// Table of students: Name, ID, Phone, Zip (and an optional Delete button)
defineProps({
    students: { type: Array, required: true },
    showDelete: { type: Boolean, default: false },
    emptyMessage: { type: String, default: 'No students to show.' }
});

defineEmits(['delete']);
</script>

<template>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Phone</th>
                    <th>Zip</th>
                    <th v-if="showDelete">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in students" :key="student.id">
                    <td>{{ student.name }}</td>
                    <td>{{ student.id }}</td>
                    <td>{{ student.phone }}</td>
                    <td>{{ student.zip }}</td>
                    <td v-if="showDelete">
                        <button type="button" class="danger" @click="$emit('delete', student)">Delete</button>
                    </td>
                </tr>
                <tr v-if="students.length === 0">
                    <td :colspan="showDelete ? 5 : 4" class="empty">{{ emptyMessage }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
