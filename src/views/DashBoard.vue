<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import CharacterComponent from '@/components/CharacterComponent.vue'
import DateManager from '@/components/DashboardComponents/DateManager.vue'
import QuestDailyView from '@/components/DashboardComponents/QuestDailyView.vue'
import { dateToString, type ViewMode } from '@/utils/dateManager'
import QuestWeeklyView from '@/components/DashboardComponents/QuestWeeklyView.vue'
import QuestMonthlyView from '@/components/DashboardComponents/QuestMonthlyView.vue'
import { QuestFrequencyMode } from '@/types/Quest'
import { getWeekDates } from '@/utils/dateManager'

const questsStore = useQuestsStore()

const actualDate = ref<string>(dateToString(new Date()))
const viewMode = ref<ViewMode>('day')
const loading = ref(true)

const dailyQuests = computed(() =>
  questsStore.quests.filter((q) => q.frequency_mode === QuestFrequencyMode.DAILY),
)
const weeklyQuests = computed(() =>
  questsStore.quests.filter((q) => q.frequency_mode === QuestFrequencyMode.WEEKLY),
)
const monthlyQuests = computed(() =>
  questsStore.quests.filter((q) => q.frequency_mode === QuestFrequencyMode.MONTHLY),
)
const occasionalQuests = computed(() =>
  questsStore.quests.filter((q) => q.frequency_mode === QuestFrequencyMode.OCCASIONAL),
)

function selectDay(date: string) {
  actualDate.value = date
  viewMode.value = 'day'
}

onMounted(async () => {
  loading.value = true
  await questsStore.fetchQuests()
  await questsStore.fetchAllQuestsStatusDuringPeriod(actualDate.value, actualDate.value)
  loading.value = false
})

watch(
  () => actualDate.value,
  (newDate) => {
    if (viewMode.value === 'day') {
      questsStore.fetchAllQuestsStatusDuringPeriod(newDate!, newDate!)
    } else if (viewMode.value === 'week') {
      const weekDates = getWeekDates(newDate!)
      questsStore.fetchAllQuestsStatusDuringPeriod(weekDates[0]!, weekDates[6]!)
    }
  },
  { immediate: true },
)
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
      <div class="quest-list">
        <h3 v-if="dailyQuests.length > 0">Quêtes journalières :</h3>
        <div v-for="quest in dailyQuests" :key="quest.quest_id">
          <QuestDailyView v-if="viewMode === 'day'" :quest="quest" :actual-date="actualDate" />
          <QuestWeeklyView
            v-else-if="viewMode === 'week'"
            :quest="quest"
            :actual-date="actualDate"
          />
        </div>
        <h3 v-if="weeklyQuests.length > 0">Quêtes hebdomadaires :</h3>
        <div v-for="quest in weeklyQuests" :key="quest.quest_id">
          <QuestDailyView v-if="viewMode === 'day'" :quest="quest" :actual-date="actualDate" />
          <QuestWeeklyView
            v-else-if="viewMode === 'week'"
            :quest="quest"
            :actual-date="actualDate"
          />
        </div>
        <h3 v-if="monthlyQuests.length > 0">Quêtes mensuelles :</h3>
        <div v-for="quest in monthlyQuests" :key="quest.quest_id">
          <QuestDailyView v-if="viewMode === 'day'" :quest="quest" :actual-date="actualDate" />
          <QuestWeeklyView
            v-else-if="viewMode === 'week'"
            :quest="quest"
            :actual-date="actualDate"
          />
        </div>
        <h3 v-if="occasionalQuests.length > 0">Quêtes occasionnelles :</h3>
        <div v-for="quest in occasionalQuests" :key="quest.quest_id">
          <QuestDailyView v-if="viewMode === 'day'" :quest="quest" :actual-date="actualDate" />
          <QuestWeeklyView
            v-else-if="viewMode === 'week'"
            :quest="quest"
            :actual-date="actualDate"
          />
        </div>
      </div>

      <QuestMonthlyView
        v-if="viewMode === 'month'"
        :actual-date="actualDate"
        @select-day="selectDay"
      />
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
</style>
