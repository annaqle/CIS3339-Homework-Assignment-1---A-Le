<script setup>
import { reactive, onMounted } from 'vue';
import { useCoursesStore } from '@/stores/courses';
import { useStatus } from '@/composables/useStatus';
import StatusMessage from '@/components/StatusMessage.vue';

const coursesStore = useCoursesStore();

// Add a course
const newCourse = reactive({ courseId: '', courseName: '' });
const addStatus = reactive(useStatus());

async function addCourse() {
    const ok = await addStatus.run(async () => {
        const course = { courseId: newCourse.courseId.trim(), courseName: newCourse.courseName.trim() };
        if (!course.courseId || !course.courseName) {
            throw new Error('All fields (Class ID, Class Name) are required.');
        }
        const data = await coursesStore.addCourse(course);
        return data.message;
    });

    if (ok) {
        Object.assign(newCourse, { courseId: '', courseName: '' });
    }
}

// List and delete courses
const listStatus = reactive(useStatus());

async function deleteCourse(course) {
    if (!confirm(`Delete course ${course.courseId}? Its enrollments will also be removed.`)) {
        return;
    }

    await listStatus.run(async () => {
        const data = await coursesStore.deleteCourse(course.courseId);
        return data.message;
    });
}

onMounted(() => {
    listStatus.run(() => coursesStore.fetchCourses());
});
</script>

<template>
    <h1>Add a Course</h1>
    <form @submit.prevent="addCourse">
        <label for="courseId">Class ID:</label>
        <input type="text" id="courseId" v-model="newCourse.courseId" required>
        <label for="courseName">Class Name:</label>
        <input type="text" id="courseName" v-model="newCourse.courseName" required>
        <button type="submit" :disabled="addStatus.loading">Add Course</button>
    </form>
    <StatusMessage :status="addStatus" />

    <h2>All Courses</h2>
    <StatusMessage :status="listStatus" />
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Class ID</th>
                    <th>Class Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="course in coursesStore.courses" :key="course.courseId">
                    <td>{{ course.courseId }}</td>
                    <td>{{ course.courseName }}</td>
                    <td>
                        <button type="button" class="danger" @click="deleteCourse(course)">Delete</button>
                    </td>
                </tr>
                <tr v-if="coursesStore.courses.length === 0">
                    <td colspan="3" class="empty">No courses yet.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
