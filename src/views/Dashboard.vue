<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  getAllHabits,
  getAllCheckedHabitIds,
  checkHabit,
  uncheckHabit
} from '@/services/habitService'
import CharacterComponent from '@/components/CharacterComponent.vue'
import DeleteButton from '@/components/DeleteButton.vue'

// ---------------------------------------------
// ----------- État réactif --------------------
// ---------------------------------------------
const actualDate = ref(toDateInputString(new Date()))
const habits = ref([])
const checkedHabitIds = ref(new Set())
const loading = ref(true)
const characterRef = ref(null)

// ---------------------------------------------
// ---------------- Fonctions ------------------
// ---------------------------------------------
function toDateInputString(dateObj) {
  return dateObj.toISOString().split('T')[0] // format YYYY-MM-DD attendu par <input type="date">
}

function shiftDate(days) {
  const current = new Date(actualDate.value)
  current.setDate(current.getDate() + days)
  actualDate.value = toDateInputString(current)
}

function previousDate() {
  shiftDate(-1)
}

function nextDate() {
  shiftDate(1)
}

async function loadHabits() {
  habits.value = await getAllHabits()
}

async function syncCheckboxes() {
  const ids = await getAllCheckedHabitIds(actualDate.value)
  checkedHabitIds.value = new Set(ids)
}

async function toggleHabit(habit) {
  const isCurrentlyChecked = checkedHabitIds.value.has(habit.habit_id)

  // Optimistic update : on met à jour l'UI avant la réponse serveur pour que ce soit instantané
  if (isCurrentlyChecked) {
    checkedHabitIds.value.delete(habit.habit_id)
  } else {
    checkedHabitIds.value.add(habit.habit_id)
  }
  checkedHabitIds.value = new Set(checkedHabitIds.value) // force la réactivité (Set n'est pas trackée nativement)

  try {
    if (isCurrentlyChecked) {
      await uncheckHabit(habit.habit_id, actualDate.value)
    } else {
      await checkHabit(habit.habit_id, actualDate.value)
    }
    await characterRef.value?.loadStats()
  } catch (err) {
    // rollback si l'appel API échoue
    if (isCurrentlyChecked) {
      checkedHabitIds.value.add(habit.habit_id)
    } else {
      checkedHabitIds.value.delete(habit.habit_id)
    }
    checkedHabitIds.value = new Set(checkedHabitIds.value)
    console.error(err)
  }
}

// Recharge automatiquement les validations dès que la date change
watch(actualDate, syncCheckboxes)

onMounted(async () => {
  loading.value = true
  await loadHabits()
  await syncCheckboxes()
  loading.value = false
})

function handleHabitDeleted(habitId) {
  habits.value = habits.value.filter(h => h.habit_id !== habitId)
}

</script>

<template>
  <div class="quest-tracker">
    <h1>📅 Suivi des Quêtes</h1>

    <!-- Système de date -->
    <div class="date-nav">
      <button class="nav-btn" @click="previousDate">◀</button>
      <input type="date" v-model="actualDate" class="date-picker" />
      <button class="nav-btn" @click="nextDate">▶</button>
    </div>

    <hr />

    <!-- Liste des habitudes -->
    <h2>✅ Liste des quêtes</h2>

    <p v-if="loading">Chargement...</p>

    <div v-else class="habit-list">
      <div v-for="habit in habits" :key="habit.habit_id" class="habit-row">
        <div class="habit-name">{{ habit.name }}</div>
        <div class="habit-info">
          ⏱️ {{ habit.time_coeff }}min | ⚡ {{ habit.difficulty_coeff }}/10
        </div>
        <div class="habit-check">
          <input
            type="checkbox"
            :checked="checkedHabitIds.has(habit.habit_id)"
            @change="toggleHabit(habit)"
          />
          <DeleteButton :habitId="habit.habit_id" @deleted="handleHabitDeleted" @error="console.error"/>
        </div>
      </div>
    </div>

    <CharacterComponent ref="characterRef"/>
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

.date-picker {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.habit-row {
  display: grid;
  grid-template-columns: 0.7fr 0.2fr 0.1fr;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
}

.habit-info {
  font-size: 0.85rem;
  color: #666;
}

.habit-check {
  display: flex;
  justify-content: center;
}

.habit-check input[type='checkbox'] {
  width: 1.3rem;
  height: 1.3rem;
  cursor: pointer;
}
</style>
