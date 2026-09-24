<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import { useArcsStore } from '@/stores/arcsStore'
import { QuestFrequencyMode } from '@/types/Quest'
import { getWeekDates, getMonthGrid } from '@/utils/dateManager'
import { dateToString, type ViewMode } from '@/utils/dateManager'
import { useRoute, useRouter } from 'vue-router'
import type { Quest } from '@/types/Quest'
import DateManager from '@/components/DashboardComponents/DateManager.vue'
import QuestDailyView from '@/components/DashboardComponents/QuestDailyView.vue'
import QuestWeeklyView from '@/components/DashboardComponents/QuestWeeklyView.vue'
import QuestMonthlyView from '@/components/DashboardComponents/QuestMonthlyView.vue'

import ArcFilter from '@/components/ArcFilter.vue'

const questsStore = useQuestsStore()
const arcStore = useArcsStore()

const route = useRoute()
const router = useRouter()

const actualDate = computed({
  get: () => (route.query.date as string) ?? dateToString(new Date()),
  set: (val) => router.push({ query: { ...route.query, date: val } }),
})

const viewMode = computed({
  get: () => (route.query.view as ViewMode) ?? 'day',
  set: (val) => router.push({ query: { ...route.query, view: val } }),
})
const loading = ref(true)

const dailyQuests = computed(() =>
  questsStore.quests.filter(
    (q) =>
      q.frequency_mode === QuestFrequencyMode.DAILY &&
      (q.arc_id === arcStore.selectedArcId || arcStore.selectedArcId === null),
  ),
)
const weeklyQuests = computed(() =>
  questsStore.quests.filter(
    (q) =>
      q.frequency_mode === QuestFrequencyMode.WEEKLY &&
      (q.arc_id === arcStore.selectedArcId || arcStore.selectedArcId === null),
  ),
)
const monthlyQuests = computed(() =>
  questsStore.quests.filter(
    (q) =>
      q.frequency_mode === QuestFrequencyMode.MONTHLY &&
      (q.arc_id === arcStore.selectedArcId || arcStore.selectedArcId === null),
  ),
)
const occasionalQuests = computed(() =>
  questsStore.quests.filter(
    (q) =>
      q.frequency_mode === QuestFrequencyMode.OCCASIONAL &&
      (q.arc_id === arcStore.selectedArcId || arcStore.selectedArcId === null),
  ),
)

function selectDay(date: string) {
  actualDate.value = date
  viewMode.value = 'day'
}

function handleSelectQuest(quest: Quest) {
  questsStore.selectedQuest = quest
  router.push({ query: { ...route.query, date: actualDate.value, view: 'month' } })
}

onMounted(async () => {
  loading.value = true
  await questsStore.fetchQuests()
  await questsStore.fetchAllQuestsStatusDuringPeriod(actualDate.value, actualDate.value)
  loading.value = false
})

watch(
  [() => actualDate.value, () => viewMode.value],
  () => {
    if (viewMode.value === 'day') {
      questsStore.fetchAllQuestsStatusDuringPeriod(actualDate.value, actualDate.value)
    } else if (viewMode.value === 'week') {
      const weekDates = getWeekDates(actualDate.value)
      questsStore.fetchAllQuestsStatusDuringPeriod(weekDates[0]!, weekDates[6]!)
    } else if (viewMode.value === 'month') {
      const dates = getMonthGrid(actualDate.value).flat()
      questsStore.fetchAllQuestsStatusDuringPeriod(dates[0]!, dates[dates.length - 1]!)
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
    </div>

    <DateManager v-model="actualDate" :mode="viewMode" />

    <hr />
    <ArcFilter v-if="viewMode !== 'month'" />

    <p v-if="loading">Chargement...</p>

    <template v-else>
      <div class="quest-list" v-if="viewMode === 'day' || viewMode === 'week'">
        <h3 v-if="dailyQuests.length > 0">Quêtes journalières :</h3>

        <template v-if="viewMode === 'day'">
          <QuestDailyView
            v-for="quest in dailyQuests"
            :key="quest.quest_id"
            :quest="quest"
            :actual-date="actualDate"
            @select-quest="handleSelectQuest"
          />
        </template>

        <QuestWeeklyView
          v-else-if="viewMode === 'week'"
          :quests="dailyQuests"
          :actual-date="actualDate"
          @select-quest="handleSelectQuest"
        />

        <h3 v-if="weeklyQuests.length > 0">Quêtes hebdomadaires :</h3>

        <template v-if="viewMode === 'day'">
          <QuestDailyView
            v-for="quest in weeklyQuests"
            :key="quest.quest_id"
            :quest="quest"
            :actual-date="actualDate"
            @select-quest="handleSelectQuest"
          />
        </template>

        <QuestWeeklyView
          v-else-if="viewMode === 'week'"
          :quests="weeklyQuests"
          :actual-date="actualDate"
          @select-quest="handleSelectQuest"
        />

        <h3 v-if="monthlyQuests.length > 0">Quêtes mensuelles :</h3>

        <template v-if="viewMode === 'day'">
          <QuestDailyView
            v-for="quest in monthlyQuests"
            :key="quest.quest_id"
            :quest="quest"
            :actual-date="actualDate"
            @select-quest="handleSelectQuest"
          />
        </template>

        <QuestWeeklyView
          v-else-if="viewMode === 'week'"
          :quests="monthlyQuests"
          :actual-date="actualDate"
          @select-quest="handleSelectQuest"
        />

        <h3 v-if="occasionalQuests.length > 0">Quêtes occasionnelles :</h3>

        <template v-if="viewMode === 'day'">
          <QuestDailyView
            v-for="quest in occasionalQuests"
            :key="quest.quest_id"
            :quest="quest"
            :actual-date="actualDate"
            @select-quest="handleSelectQuest"
          />
        </template>

        <QuestWeeklyView
          v-else-if="viewMode === 'week'"
          :quests="occasionalQuests"
          :actual-date="actualDate"
          @select-quest="handleSelectQuest"
        />
      </div>

      <QuestMonthlyView
        v-if="viewMode === 'month'"
        :actual-date="actualDate"
        :quest="questsStore.selectedQuest!"
        @select-day="selectDay"
      />
    </template>
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
