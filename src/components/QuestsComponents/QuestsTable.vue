<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchQuests } from '../../services/questsService.ts'
import DeleteQuestButton from './DeleteQuestButton.vue'
import { useQuestsStore } from '../../stores/questsStore'

const questStore = useQuestsStore()

onMounted(() => {
  questStore.fetchQuests()
})
</script>

<template>
  <!-- Tableau des quêtes -->
  <table class="quest-table">
    <thead>
    <tr>
      <th>Nom</th>
      <th>Temps</th>
      <th>Difficulté</th>
      <th>Importance</th>
      <th>Supprimer</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="quest in questStore.quests" :key="quest.quest_id">
      <td>{{ quest.name }}</td>
      <td>{{ quest.time_coeff }}</td>
      <td>{{ quest.difficulty_coeff }}</td>
      <td>{{ quest.importance_coeff }}</td>
      <td>
        <DeleteQuestButton :questId="quest.quest_id" @error="console.error"/>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>
.quest-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.quest-table th,
.quest-table td {
  border: 1px solid #e5e5e5;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
</style>
