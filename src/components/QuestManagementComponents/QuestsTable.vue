<script setup lang="ts">
import { onMounted, computed } from 'vue'
import DeleteQuestButton from './DeleteQuestButton.vue'
import { useQuestsStore } from '../../stores/questsStore.ts'
import { useArcsStore } from '../../stores/arcsStore.ts'
import type { Quest } from '@/types/Quest.ts'

const arcStore = useArcsStore()
const questStore = useQuestsStore()

const emit = defineEmits<{ editQuest: [quest: Quest] }>()

const filteredQuests = computed(() => {
  if (arcStore.selectedArcId === null) {
    return questStore.quests
  }
  return questStore.quests.filter((q) => q.arc_id === arcStore.selectedArcId)
})

onMounted(() => {
  questStore.fetchQuests()
})
</script>

<template>
  <!-- Tableau des quêtes -->
  <table class="quest-table">
    <thead>
      <tr>
        <th>Id</th>
        <th>Nom</th>
        <th>Arc</th>
        <th>Temps</th>
        <th>Difficulté</th>
        <th>Importance</th>
        <th>Fréquence</th>
        <th>Modifier</th>
        <th>Supprimer</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quest in filteredQuests" :key="quest.quest_id">
        <td>{{ quest.quest_id }}</td>
        <td>{{ quest.name }}</td>
        <td>{{ quest.arc_id ? arcStore.getArcNameById(quest.arc_id) : 'Aucun arc' }}</td>
        <td>{{ quest.time_coeff }}</td>
        <td>{{ quest.difficulty_coeff }}</td>
        <td>{{ quest.importance_coeff }}</td>
        <td>{{ quest.frequency_mode }} - {{ quest.frequency }}</td>
        <td>
          <button @click="emit('editQuest', quest)" class="edit-btn">✏️</button>
        </td>
        <td>
          <DeleteQuestButton :quest="quest" @error="console.error" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.edit-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s ease;
}

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
