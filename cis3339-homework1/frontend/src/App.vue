<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <nav aria-label="Main navigation">
        <RouterLink to="/">Students</RouterLink> |
        <RouterLink to="/courses">Courses</RouterLink> |
        <RouterLink to="/enrollments">Enrollments</RouterLink>
    </nav>
    <main>
        <RouterView />
    </main>
</template>

<style>
:root {
    --text: #1f2933;
    --background: #f5f7fa;
    --surface: #ffffff;
    --border: #cbd2d9;
    --primary: #1f4e8c;
    --danger: #b42318;
    --success: #1e7b34;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: var(--text);
    background: var(--background);
}

nav {
    padding: 12px 16px;
    background: var(--primary);
    color: #ffffff;
}

nav a {
    color: #ffffff;
    margin: 0 4px;
}

nav a.router-link-exact-active {
    font-weight: bold;
}

main {
    max-width: 800px;
    margin: 0 auto;
    padding: 16px;
}

h1 {
    font-size: 1.6rem;
}

form {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: 8px 12px;
    align-items: center;
    padding: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 6px;
}

form button {
    grid-column: 1 / -1;
    justify-self: start;
}

input,
select,
button {
    font: inherit;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
}

input,
select {
    width: 100%;
    min-width: 0;
}

button {
    color: #ffffff;
    background: var(--primary);
    border-color: var(--primary);
    cursor: pointer;
}

button.danger {
    background: var(--danger);
    border-color: var(--danger);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.message {
    padding: 8px 12px;
    border-radius: 4px;
}

.message.loading {
    background: #e4e7eb;
}

.message.error {
    color: var(--danger);
    background: #fdecea;
}

.message.success {
    color: var(--success);
    background: #e6f4ea;
}

.table-wrapper {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface);
}

th,
td {
    padding: 8px;
    border: 1px solid var(--border);
    text-align: left;
}

th {
    background: #e4e7eb;
}

td.empty {
    color: #616e7c;
    font-style: italic;
}

/* Phones: stack labels above inputs */
@media (max-width: 600px) {
    form {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
