<script setup lang="ts">
import { computed } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import type { Quest } from '@/types/Quest'
import { getWeekDates, formatDayLabel } from '@/utils/dateManager'

const props = defineProps<{
  quest: Quest
  actualDate: string
}>()

const questsStore = useQuestsStore()

const weekDates = computed(() => getWeekDates(props.actualDate))

const questStatusByDate = computed(() => questsStore.questsStatus[props.quest.quest_id])

async function toggle(questId: number, date: string) {
  if (!questStatusByDate.value) return
  if (questStatusByDate.value[date]?.checked) {
    await questsStore.uncheckQuest(questId, date)
  } else {
    await questsStore.checkQuest(questId, date)
  }
}
</script>

<template>
  <table class="week-table">
    <thead>
      <tr>
        <th v-for="date in weekDates" :key="date">{{ formatDayLabel(date) }}</th>
      </tr>
    </thead>
    <tbody>
      <td v-for="date in weekDates" :key="date" class="check-cell">
        <input
          type="checkbox"
          :checked="questStatusByDate.value?.[date]?.checked"
          @change="toggle(quest.quest_id, date)"
        />
      </td>
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
