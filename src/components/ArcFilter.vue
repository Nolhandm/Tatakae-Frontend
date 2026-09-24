<script setup lang="ts">
import { onMounted } from 'vue'
import { useArcsStore } from '@/stores/arcsStore'

const arcStore = useArcsStore()

onMounted(() => {
  arcStore.fetchArcs()
})
</script>

<template>
  <label class="arc-filter">
    Filtrer par arc
    <select v-model.number="arcStore.selectedArcId">
      <option :value="null">Toutes les quêtes</option>
      <option v-for="arc in arcStore.arcs" :key="arc.arc_id" :value="arc.arc_id">
        {{ arc.name }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.arc-filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  max-width: 250px;
}

.arc-filter select {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
