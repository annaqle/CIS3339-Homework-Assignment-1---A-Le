import { ref } from 'vue';

// Tracks loading, error, and success messages for one action (search, add, delete, ...)
export function useStatus() {
    const loading = ref(false);
    const error = ref('');
    const success = ref('');

    // Runs an async action. The action returns the success message, or throws an error.
    async function run(action) {
        loading.value = true;
        error.value = '';
        success.value = '';
        try {
            success.value = (await action()) || '';
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    return { loading, error, success, run };
}
