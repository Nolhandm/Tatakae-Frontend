<script setup lang="ts">
import { ref } from 'vue'
import { useArcsStore } from '@/stores/arcsStore'
import type { ArcCreate } from '@/types/Arc'

const emit = defineEmits(['created'])
const arcStore = useArcsStore()

const nom = ref('')
const description = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''

  if (!nom.value || nom.value.trim() === '') {
    errorMessage.value = "Le nom n'est pas valide"
    return
  }

  const newArc: ArcCreate = {
    name: nom.value,
    description: description.value
  }

  try {
    await arcStore.createArc(newArc)
    nom.value = ''
    description.value = ''
    errorMessage.value = ''
    emit('created')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  }
}
</script>

<template>
  <form class="arc-form" @submit.prevent="handleSubmit">
    <h3>➕ Nouvel arc</h3>

    <label>
      Nom de l'arc
      <input v-model="nom" type="text" placeholder="Nom de l'arc" />
    </label>

    <label>
      Description de l'arc
      <input v-model="description" type="text" placeholder="Description de l'arc" />
    </label>

    <button type="submit">Ajouter</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.arc-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.arc-form button[type='submit'] {
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
