import { ref } from 'vue';
import { defineStore } from 'pinia';
import { request } from '@/api';

// Shared course list (used by the Courses and Enrollments pages)
export const useCoursesStore = defineStore('courses', () => {
    const courses = ref([]);

    async function fetchCourses() {
        courses.value = await request('/list-courses');
    }

    async function addCourse(course) {
        const data = await request('/add-course', course);
        courses.value.push(data.course);
        return data;
    }

    async function deleteCourse(courseId) {
        const data = await request('/delete-course', { courseId });
        courses.value = courses.value.filter((course) => course.courseId !== courseId);
        return data;
    }

    return { courses, fetchCourses, addCourse, deleteCourse };
});
