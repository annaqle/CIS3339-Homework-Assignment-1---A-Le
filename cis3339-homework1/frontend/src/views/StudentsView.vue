<script setup>
import { ref, reactive, computed } from 'vue';
import { useStudentsStore } from '@/stores/students';
import { useStatus } from '@/composables/useStatus';
import StudentTable from '@/components/StudentTable.vue';
import StatusMessage from '@/components/StatusMessage.vue';

const studentsStore = useStudentsStore();

// Search for a student
const studentName = ref('');
const result = ref([]);
const searched = ref(false);
const resultStatus = reactive(useStatus());

const emptyMessage = computed(() =>
    searched.value ? 'No student found.' : 'Search for a student to see the result.'
);

async function searchStudent() {
    result.value = [];
    await resultStatus.run(async () => {
        if (!studentName.value) {
            throw new Error('Student name is required.');
        }
        result.value = [await studentsStore.findStudent(studentName.value)];
    });
    searched.value = true;
}

async function deleteStudent(student) {
    if (!confirm(`Delete student ${student.name}?`)) {
        return;
    }

    await resultStatus.run(async () => {
        const data = await studentsStore.deleteStudent(student.name);
        result.value = [];
        return data.message;
    });
}

// Add a student
const newStudent = reactive({ name: '', id: '', phone: '', zip: '' });
const addStatus = reactive(useStatus());

async function addStudent() {
    const ok = await addStatus.run(async () => {
        const student = {
            name: newStudent.name.trim(),
            id: String(newStudent.id).trim(),
            phone: newStudent.phone.trim(),
            zip: newStudent.zip.trim()
        };
        if (!student.name || !student.id || !student.phone || !student.zip) {
            throw new Error('All fields (name, id, phone, zip) are required.');
        }
        const data = await studentsStore.addStudent(student);
        return data.message;
    });

    if (ok) {
        Object.assign(newStudent, { name: '', id: '', phone: '', zip: '' });
    }
}
</script>

<template>
    <h1>Search for a Student</h1>
    <form @submit.prevent="searchStudent">
        <label for="studentName">Student Name:</label>
        <input type="text" id="studentName" v-model.trim="studentName" required>
        <button type="submit" :disabled="resultStatus.loading">Search</button>
    </form>

    <h1>Add a Student</h1>
    <form @submit.prevent="addStudent">
        <label for="addName">Name:</label>
        <input type="text" id="addName" v-model="newStudent.name" required>
        <label for="addId">ID:</label>
        <input type="number" id="addId" v-model="newStudent.id" required>
        <label for="addPhone">Phone:</label>
        <input type="text" id="addPhone" v-model="newStudent.phone" required>
        <label for="addZip">Zip:</label>
        <input type="text" id="addZip" v-model="newStudent.zip" required>
        <button type="submit" :disabled="addStatus.loading">Add Student</button>
    </form>
    <StatusMessage :status="addStatus" />

    <h2>Result:</h2>
    <StatusMessage :status="resultStatus" />
    <StudentTable :students="result" :empty-message="emptyMessage" show-delete @delete="deleteStudent" />
</template>
