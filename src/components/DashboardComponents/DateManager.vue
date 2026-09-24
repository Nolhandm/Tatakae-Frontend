<script setup lang="ts">
import { computed } from 'vue'
import { dateToString, getWeekDates, type ViewMode, shiftDateByMode } from '@/utils/dateManager'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps<{ mode: ViewMode }>()

const actualDate = defineModel<string>({
  default: () => dateToString(new Date()),
})

const weekRangeValue = computed<[string, string]>({
  get() {
    const dates = getWeekDates(actualDate.value)
    return [dates[0], dates[6]] as [string, string]
  },
  set(val) {
    if (val && val[0]) {
      actualDate.value = dateToString(new Date(val[0]))
    }
  },
})

const monthPickerValue = computed<{ month: number; year: number }>({
  get() {
    const d = new Date(actualDate.value)
    return { month: d.getMonth(), year: d.getFullYear() }
  },
  set(val) {
    if (val) {
      const d = new Date(val.year, val.month, 1)
      actualDate.value = dateToString(d)
    }
  },
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

    <VueDatePicker
      v-if="props.mode === 'day'"
      v-model="actualDate"
      model-type="yyyy-MM-dd"
      auto-apply
      timezone="Europe/Paris"
      :time-config="{ enableTimePicker: false }"
      :formats="{ input: 'dd/MM/yyyy' }"
      :ui="{ input: 'date-picker' }"
      :input-attrs="{ clearable: false }"
      :week-start="1"
    />

    <VueDatePicker
      v-if="props.mode === 'week'"
      v-model="weekRangeValue"
      auto-apply
      week-picker
      timezone="Europe/Paris"
      :time-config="{ enableTimePicker: false }"
      :formats="{ input: 'dd/MM/yyyy' }"
      :ui="{ input: 'date-picker' }"
      :input-attrs="{ clearable: false }"
      :week-start="1"
    />

    <VueDatePicker
      v-if="props.mode === 'month'"
      v-model="monthPickerValue"
      month-picker
      auto-apply
      timezone="Europe/Paris"
      :time-config="{ enableTimePicker: false }"
      :ui="{ input: 'date-picker' }"
      :input-attrs="{ clearable: false }"
      :week-start="1"
    />

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

:deep(.date-picker) {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: center;
  padding: 0.4rem 0.6rem;
}
</style>
