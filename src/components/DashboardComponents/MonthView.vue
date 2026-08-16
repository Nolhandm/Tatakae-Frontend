<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import { getMonthGrid } from '@/utils/dateManager'

const props = defineProps<{ actualDate: string }>()
const emit = defineEmits<{ selectDay: [date: string] }>()

const questsStore = useQuestsStore()
const weeks = computed(() => getMonthGrid(props.actualDate))
const allDates = computed(() => weeks.value.flat())

watch(
  allDates,
  (dates) => {
    questsStore.fetchAllCheckedQuestIdsDuringPeriod(dates[0]!, dates[dates.length - 1]!)
  },
  { immediate: true },
)

function completionRatio(date: string): number {
  const total = questsStore.quests.length
  if (total === 0) return 0
  const checked = questsStore.checkedQuestIdsByDate[date]?.size ?? 0
  return checked / total
}

function isCurrentMonth(date: string): boolean {
  return new Date(date).getMonth() === new Date(props.actualDate).getMonth()
}
</script>

<template>
  <div class="month-grid">
    <div v-for="week in weeks" :key="week[0]" class="month-week">
      <div
        v-for="date in week"
        :key="date"
        class="month-cell"
        :class="{ 'other-month': !isCurrentMonth(date) }"
        :style="{ '--fill': `${completionRatio(date) * 100}%` }"
        @click="emit('selectDay', date)"
      >
        <span class="day-number">{{ new Date(date).getDate() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.month-grid {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.month-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
}
.month-cell {
  position: relative;
  aspect-ratio: 1;
  border: 1px solid #eee;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, #a7f3d0 var(--fill), transparent var(--fill));
  transition: background 0.3s ease;
}
.month-cell:hover {
  border-color: #4f46e5;
}
.other-month {
  opacity: 0.35;
}
.day-number {
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
