<script setup>
// Shows the loading, error, or success message from useStatus()
defineProps({
    status: { type: Object, required: true }
});
</script>

<template>
    <p v-if="status.loading" class="message loading" role="status">Loading...</p>
    <p v-else-if="status.error" class="message error" role="alert">{{ status.error }}</p>
    <p v-else-if="status.success" class="message success" role="status">{{ status.success }}</p>
</template>
