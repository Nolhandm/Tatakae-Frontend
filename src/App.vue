<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}
</style>
