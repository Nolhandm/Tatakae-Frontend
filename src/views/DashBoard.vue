<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import CharacterComponent from '@/components/CharacterComponent.vue'
import DateManager from '@/components/DashboardComponents/DateManager.vue'
import QuestDaily from '@/components/DashboardComponents/QuestDaily.vue'
import { dateToString, type ViewMode } from '@/utils/dateManager'
import WeekView from '@/components/DashboardComponents/WeekView.vue'
import MonthView from '@/components/DashboardComponents/MonthView.vue'

const questsStore = useQuestsStore()

const actualDate = ref<string>(dateToString(new Date()))
const viewMode = ref<ViewMode>('day')
const loading = ref(true)

function selectDay(date: string) {
  actualDate.value = date
  viewMode.value = 'day'
}

onMounted(async () => {
  loading.value = true
  await questsStore.fetchQuests()
  loading.value = false
})
</script>

<template>
  <div class="quest-tracker">
    <h1>📅 Suivi des Quêtes</h1>

    <div class="mode-switch">
      <button :class="{ active: viewMode === 'day' }" @click="viewMode = 'day'">Jour</button>
      <button :class="{ active: viewMode === 'week' }" @click="viewMode = 'week'">Semaine</button>
      <button :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">Mois</button>
    </div>

    <DateManager v-model="actualDate" :mode="viewMode" />

    <hr />

    <p v-if="loading">Chargement...</p>

    <template v-else>
      <div v-if="viewMode === 'day'" class="quest-list">
        <div v-for="quest in questsStore.quests" :key="quest.quest_id" class="quest-row">
          <QuestDaily :quest="quest" :actual-date="actualDate" />
        </div>
      </div>

      <WeekView v-else-if="viewMode === 'week'" :actual-date="actualDate" />

      <MonthView v-else :actual-date="actualDate" @select-day="selectDay" />
    </template>

    <CharacterComponent />
  </div>
</template>

<style scoped>
.mode-switch {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.mode-switch button {
  padding: 0.4rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.mode-switch button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.quest-row {
  display: grid;
  grid-template-columns: 0.7fr 0.2fr 0.1fr;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
}
</style>
