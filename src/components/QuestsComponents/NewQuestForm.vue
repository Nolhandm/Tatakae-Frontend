<script setup lang="ts">
import { ref } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import type { QuestCreate } from '@/types/Quest'

const questStore = useQuestsStore()

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const isExpanded = ref(false)
const nom = ref('')
const temps = ref(5)
const difficulte = ref(5)
const importance = ref(5)
const errorMessage = ref('')
const successMessage = ref('')


async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!nom.value || nom.value.trim() === '') {
    errorMessage.value = "Le nom n'est pas valide"
    return
  }

  const newQuest: QuestCreate = {
    name: nom.value,
    time_coeff: temps.value,
    difficulty_coeff: difficulte.value,
    importance_coeff: importance.value
  }

  try {
    await questStore.createQuest(newQuest)
    successMessage.value = 'Quête ajoutée !'
    nom.value = ''
    temps.value = 5
    difficulte.value = 5
    importance.value = 5
    isExpanded.value = false
  } catch (err) {
    errorMessage.value = err.message
  }
}


</script>

<template>
  <div class="quest-manager">
    <!-- Expander -->
    <div class="expander">
      <button class="expander-header" @click="isExpanded = !isExpanded">
        ➕ Ajouter une nouvelle quête
        <span class="chevron" :class="{ open: isExpanded }">▾</span>
      </button>

      <form v-if="isExpanded" class="quest-form" @submit.prevent="handleSubmit">
        <label>
          Nom de la quête
          <input v-model="nom" type="text" placeholder="Nom de la quête" />
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

.quest-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-top: none;
}

.quest-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.25rem;
}

.quest-form button[type='submit'] {
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


</style>
