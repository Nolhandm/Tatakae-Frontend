<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Quest } from '@/types/Quest'
import { useArcsStore } from '@/stores/arcsStore'
import { type QuestCreate, QuestFrequencyMode } from '@/types/Quest'

const props = defineProps<{
  initialQuest?: Quest | null
}>()

const emit = defineEmits<{
  submit: [quest: QuestCreate | Quest]
  cancel: []
}>()

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

function resetFromQuest(quest?: Quest | null) {
  nom.value = quest?.name ?? ''
  temps.value = quest?.time_coeff ?? 5
  difficulte.value = quest?.difficulty_coeff ?? 5
  importance.value = quest?.importance_coeff ?? 5
  arcId.value = quest?.arc_id ?? null
  frequencyMode.value = quest?.frequency_mode ?? QuestFrequencyMode.DAILY
  frequency.value = quest?.frequency
}

watch(() => props.initialQuest, resetFromQuest, { immediate: true })

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

  const payload: QuestCreate = {
    name: nom.value,
    time_coeff: temps.value,
    difficulty_coeff: difficulte.value,
    importance_coeff: importance.value,
    arc_id: arcId.value,
    frequency_mode: frequencyMode.value,
    frequency: frequency.value!,
  }

  if (props.initialQuest) {
    emit('submit', { ...payload, quest_id: props.initialQuest.quest_id })
  } else {
    emit('submit', payload)
  }
}
</script>

<template>
  <form class="quest-form" @submit.prevent="handleSubmit">
    <h3>{{ props.initialQuest ? '✏️ Modifier la quête' : '➕ Nouvelle quête' }}</h3>

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

    <button type="submit">{{ props.initialQuest ? 'Enregistrer' : 'Ajouter' }}</button>

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
