<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import { getWeekDates, formatDayLabel } from '@/utils/dateManager'

const props = defineProps<{ actualDate: string }>()
const questsStore = useQuestsStore()

const weekDates = computed(() => getWeekDates(props.actualDate))

watch(
  weekDates,
  (dates) => {
    questsStore.fetchAllCheckedQuestIdsDuringPeriod(dates[0]!, dates[6]!)
  },
  { immediate: true },
)

async function toggle(questId: number, date: string) {
  if (questsStore.isQuestCheckedOnDate(questId, date)) {
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
        <th>Quête</th>
        <th v-for="date in weekDates" :key="date">{{ formatDayLabel(date) }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quest in questsStore.quests" :key="quest.quest_id">
        <td>{{ quest.name }}</td>
        <td v-for="date in weekDates" :key="date" class="check-cell">
          <input
            type="checkbox"
            :checked="questsStore.isQuestCheckedOnDate(quest.quest_id, date)"
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
