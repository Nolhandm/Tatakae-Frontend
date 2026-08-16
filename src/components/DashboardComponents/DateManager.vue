<script setup lang="ts">
import { dateToString, type ViewMode, shiftDateByMode, formatMonthLabel } from '@/utils/dateManager'
import { computed } from 'vue'

const props = defineProps<{ mode: ViewMode }>()

const actualDate = defineModel<string>({
  default: () => dateToString(new Date()),
})

const label = computed(() => {
  if (props.mode === 'month') return formatMonthLabel(actualDate.value)
  return actualDate.value
})

function previousDate() {
  actualDate.value = shiftDateByMode(actualDate.value, props.mode, -1)
}

function nextDate() {
  actualDate.value = shiftDateByMode(actualDate.value, props.mode, 1)
}
</script>

<template>
  <!-- Système de date -->
  <div class="date-nav">
    <button class="nav-btn" @click="previousDate">◀</button>
    <input v-if="mode === 'day'" type="date" v-model="actualDate" class="date-picker" />
    <span v-else class="date-label">{{ label }}</span>
    <button class="nav-btn" @click="nextDate">▶</button>
  </div>
</template>

<style scoped>
.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.nav-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}
.nav-btn:hover {
  background: #f5f5f5;
}

.date-label,
.date-picker {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}
</style>
