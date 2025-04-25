<template>
    <div>123</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const a = ref(1);
onMounted(() => {
    console.log(a.value);
});
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
