<script setup>
import { ref, onMounted } from 'vue'
import { addNewHabit, getAllHabits } from '@/services/habitService'

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const isExpanded = ref(false)
const nom = ref('')
const temps = ref(5)
const difficulte = ref(5)
const importance = ref(5)
const errorMessage = ref('')
const successMessage = ref('')
const habitudes = ref([])

async function loadHabits() {
  habitudes.value = await getAllHabits()
}

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!nom.value || nom.value.trim() === '') {
    errorMessage.value = "Le nom n'est pas valide"
    return
  }

  try {
    await addNewHabit(nom.value, temps.value, difficulte.value, importance.value)
    successMessage.value = 'Habitude ajoutée !'
    nom.value = ''
    temps.value = 5
    difficulte.value = 5
    importance.value = 5
    isExpanded.value = false
    await loadHabits()
  } catch (err) {
    errorMessage.value = err.message
  }
}

onMounted(loadHabits)
</script>

<template>
  <div class="habit-manager">
    <!-- Expander -->
    <div class="expander">
      <button class="expander-header" @click="isExpanded = !isExpanded">
        ➕ Ajouter une nouvelle habitude
        <span class="chevron" :class="{ open: isExpanded }">▾</span>
      </button>

      <form v-if="isExpanded" class="habit-form" @submit.prevent="handleSubmit">
        <label>
          Nom de l'habitude
          <input v-model="nom" type="text" placeholder="Nom de l'habitude" />
        </label>

        <label>
          Temps
          <select v-model.number="temps">
            <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>

        <label>
          Difficulté
          <select v-model.number="difficulte">
            <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>

        <label>
          Importance
          <select v-model.number="importance">
            <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>

        <button type="submit">Ajouter</button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
    </div>

    <!-- Tableau des habitudes -->
    <table class="habit-table">
      <thead>
      <tr>
        <th>Nom</th>
        <th>Temps</th>
        <th>Difficulté</th>
        <th>Importance</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="habit in habitudes" :key="habit.habit_id">
        <td>{{ habit.name }}</td>
        <td>{{ habit.time_coeff }}</td>
        <td>{{ habit.difficulty_coeff }}</td>
        <td>{{ habit.importance_coeff }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.expander-header {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chevron {
  transition: transform 0.2s ease;
}
.chevron.open {
  transform: rotate(180deg);
}

.habit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-top: none;
}

.habit-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.25rem;
}

.habit-form button[type='submit'] {
  align-self: flex-start;
  padding: 0.5rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.error {
  color: #dc2626;
}
.success {
  color: #16a34a;
}

.habit-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.habit-table th,
.habit-table td {
  border: 1px solid #e5e5e5;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
</style>
