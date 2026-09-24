<script setup>
import NavBar from '@/components/NavBar.vue'
import SideDrawer from '@/components/SideDrawer.vue'
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
  <SideDrawer />
</template>

<style scoped>
main {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}
</style>
