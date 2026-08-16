<script setup lang="ts">
import { ref } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import { useArcsStore } from '@/stores/arcsStore'
import { type QuestCreate, QuestFrequencyMode } from '@/types/Quest'

const emit = defineEmits(['created'])

const questStore = useQuestsStore()
const arcStore = useArcsStore()

const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const nom = ref('')
const temps = ref(5)
const difficulte = ref(5)
const importance = ref(5)
const arcId = ref<number | null>(null)
const frequencyMode = ref<QuestFrequencyMode>(QuestFrequencyMode.DAILY)
const frequency = ref<number>()
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  if (!nom.value || nom.value.trim() === '') {
    errorMessage.value = "Le nom n'est pas valide"
    return
  }

  if (frequencyMode.value == QuestFrequencyMode.DAILY) {
    frequency.value = 1
  }

  if (frequencyMode.value == QuestFrequencyMode.OCCASIONAL) {
    frequency.value = 0
  }

  const newQuest: QuestCreate = {
    name: nom.value,
    time_coeff: temps.value,
    difficulty_coeff: difficulte.value,
    importance_coeff: importance.value,
    arc_id: arcId.value,
    frequency_mode: frequencyMode.value,
    frequency: frequency.value!,
  }

  try {
    await questStore.createQuest(newQuest)
    nom.value = ''
    temps.value = 5
    difficulte.value = 5
    importance.value = 5
    arcId.value = null
    errorMessage.value = ''
    emit('created')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  }
}
</script>

<template>
  <form class="quest-form" @submit.prevent="handleSubmit">
    <h3>➕ Nouvelle quête</h3>

    <label>
      Nom de la quête
      <input v-model="nom" type="text" placeholder="Nom de la quête" />
    </label>

    <label>
      Arc
      <select v-model.number="arcId">
        <option :value="null">-- Aucun arc --</option>
        <option v-for="arc in arcStore.arcs" :key="arc.arc_id" :value="arc.arc_id">
          {{ arc.name }}
        </option>
      </select>
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

    <label>
      Mode de fréquence
      <select v-model="frequencyMode">
        <option v-for="mode in Object.values(QuestFrequencyMode)" :key="mode" :value="mode">
          {{ mode }}
        </option>
      </select>
    </label>

    <label
      v-if="
        frequencyMode !== QuestFrequencyMode.OCCASIONAL &&
        frequencyMode !== QuestFrequencyMode.DAILY
      "
    >
      Fréquence
      <select v-model.number="frequency">
        <div v-if="frequencyMode === QuestFrequencyMode.WEEKLY">
          <option v-for="opt in [1, 2, 3, 4, 5, 6]" :key="opt" :value="opt">{{ opt }}</option>
        </div>
        <div v-if="frequencyMode === QuestFrequencyMode.MONTHLY">
          <option v-for="opt in [1, 2, 3, 4]" :key="opt" :value="opt">{{ opt }}</option>
        </div>
      </select>
    </label>

    <button type="submit">Ajouter</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.quest-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
</style>
