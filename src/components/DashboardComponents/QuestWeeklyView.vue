<script setup lang="ts">
import { computed } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import type { Quest } from '@/types/Quest'
import { getWeekDates, formatDayLabel } from '@/utils/dateManager'

const props = defineProps<{
  quests: Quest[]
  actualDate: string
  header?: boolean
}>()

const questsStore = useQuestsStore()

const emit = defineEmits<{ selectQuest: [quest: Quest] }>()

const weekDates = computed(() => getWeekDates(props.actualDate))

function getStatusForDate(questId: number, date: string) {
  return questsStore.questsStatus[questId]?.[date]
}
async function toggle(questId: number, date: string) {
  if (!getStatusForDate(questId, date)) return
  if (getStatusForDate(questId, date)?.checked) {
    await questsStore.uncheckQuest(questId, date)
  } else {
    await questsStore.checkQuest(questId, date)
  }
}
</script>

<template>
  <table class="week-table" v-if="props.quests.length > 0">
    <thead>
      <tr>
        <th>Quête</th>
        <th v-for="date in weekDates" :key="date">{{ formatDayLabel(date) }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quest in props.quests" :key="quest.quest_id">
        <td @click="emit('selectQuest', quest)" style="cursor: pointer">
          {{ quest.name }}
          <div class="quest-info">
            ⏱️ {{ quest.time_coeff }} | ⚡ {{ quest.difficulty_coeff }} | ❗
            {{ quest.importance_coeff }}
          </div>
          <div class="quest-info">
            🔥 {{ getStatusForDate(quest.quest_id, weekDates[6]!)?.streak }}
          </div>
        </td>
        <td v-for="date in weekDates" :key="date" class="check-cell">
          <input
            type="checkbox"
            :checked="getStatusForDate(quest.quest_id, date)?.checked"
            @change="toggle(quest.quest_id, date)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.week-table {
  width: 100%;
  border-collapse: collapse;
}
.week-table th,
.week-table td {
  border: 1px solid #eee;
  padding: 0.5rem;
  text-align: center;
}
.week-table th:first-child,
.week-table td:first-child {
  text-align: left;
}
.check-cell input {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}
</style>
