import { ref } from 'vue';
import { defineStore } from 'pinia';
import { request } from '@/api';

// Shared student list (used by the Students and Enrollments pages)
export const useStudentsStore = defineStore('students', () => {
    const students = ref([]);

    async function fetchStudents() {
        students.value = await request('/list-students');
    }

    async function findStudent(name) {
        return request('/find-student', { name });
    }

    async function addStudent(student) {
        const data = await request('/add-student', student);
        students.value.push(data.student);
        return data;
    }

    async function deleteStudent(name) {
        const data = await request('/delete-student', { name });
        students.value = students.value.filter((student) => student.id !== data.student.id);
        return data;
    }

    return { students, fetchStudents, findStudent, addStudent, deleteStudent };
});
