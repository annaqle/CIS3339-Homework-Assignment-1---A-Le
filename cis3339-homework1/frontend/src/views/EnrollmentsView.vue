<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { request } from '@/api';
import { useStudentsStore } from '@/stores/students';
import { useCoursesStore } from '@/stores/courses';
import { useStatus } from '@/composables/useStatus';
import CourseSelect from '@/components/CourseSelect.vue';
import StudentTable from '@/components/StudentTable.vue';
import StatusMessage from '@/components/StatusMessage.vue';

const studentsStore = useStudentsStore();
const coursesStore = useCoursesStore();
const loadStatus = reactive(useStatus());

// Enroll a student in a course
const selectedStudentId = ref('');
const enrollCourseId = ref('');
const enrollStatus = reactive(useStatus());

async function enrollStudent() {
    await enrollStatus.run(async () => {
        if (!selectedStudentId.value || !enrollCourseId.value) {
            throw new Error('Please select a student and a course.');
        }
        const data = await request('/enroll-student', {
            studentId: selectedStudentId.value,
            courseId: enrollCourseId.value
        });
        return data.message;
    });
}

// List the students in a course
const rosterCourseId = ref('');
const roster = ref([]);
const listed = ref(false);
const rosterStatus = reactive(useStatus());

const emptyMessage = computed(() =>
    listed.value ? 'No students are enrolled in this course.' : 'Select a course to see its students.'
);

async function listStudents() {
    roster.value = [];
    await rosterStatus.run(async () => {
        if (!rosterCourseId.value) {
            throw new Error('Please select a course.');
        }
        roster.value = await request('/course-students', { courseId: rosterCourseId.value });
    });
    listed.value = true;
}

onMounted(() => {
    loadStatus.run(async () => {
        await Promise.all([studentsStore.fetchStudents(), coursesStore.fetchCourses()]);
    });
});
</script>

<template>
    <StatusMessage :status="loadStatus" />

    <h1>Enroll Student in Course</h1>
    <form @submit.prevent="enrollStudent">
        <label for="enrollStudent">Select Student:</label>
        <select id="enrollStudent" v-model="selectedStudentId" required>
            <option value="">-- Select Student --</option>
            <option v-for="student in studentsStore.students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.id }})
            </option>
        </select>
        <CourseSelect id="enrollCourse" v-model="enrollCourseId" />
        <button type="submit" :disabled="enrollStatus.loading">Enroll Student</button>
    </form>
    <StatusMessage :status="enrollStatus" />

    <h2>Students in Course</h2>
    <form @submit.prevent="listStudents">
        <CourseSelect id="rosterCourse" v-model="rosterCourseId" />
        <button type="submit" :disabled="rosterStatus.loading">List Students</button>
    </form>
    <StatusMessage :status="rosterStatus" />
    <StudentTable :students="roster" :empty-message="emptyMessage" />
</template>
