<script setup>
import { useCoursesStore } from '@/stores/courses';

// Course dropdown filled from the courses store. Use with v-model (selected course ID).
defineProps({
    id: { type: String, required: true }
});

const selectedCourseId = defineModel({ type: String, default: '' });
const coursesStore = useCoursesStore();
</script>

<template>
    <label :for="id">Select Course:</label>
    <select :id="id" v-model="selectedCourseId" required>
        <option value="">-- Select Course --</option>
        <option v-for="course in coursesStore.courses" :key="course.courseId" :value="course.courseId">
            {{ course.courseName }} ({{ course.courseId }})
        </option>
    </select>
</template>
