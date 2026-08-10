<script setup lang="ts">
import { deleteHabit } from '@/services/habitService'
import { ref } from 'vue'

const props = defineProps({
  habitId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['deleted','error'])

const isConfirming = ref(false)
const isDeleting = ref(false)

function askConfirmation() {
  isConfirming.value = true
}

function cancelConfirmation() {
  isConfirming.value = false
}

async function confirmDelete() {
  isDeleting.value = true
  try {
    await deleteHabit(props.habitId)
    emit('deleted', props.habitId)
  } catch (err) {
    emit('error', err)
    console.error(err)
  } finally {
    isDeleting.value = false
    isConfirming.value = false
  }
}

</script>

<template>
  <div class="delete-habit">
    <button
      v-if="!isConfirming"
      class="delete-btn"
      @click="askConfirmation"
      :disabled="isDeleting"
      title="Supprimer l'habitude"
    >
      🗑️
    </button>

    <div v-else class="confirm-box">
      <span class="confirm-text">Supprimer{{ habitName ? ` "${habitName}"` : '' }} ?</span>
      <button class="confirm-yes" @click="confirmDelete" :disabled="isDeleting">
        {{ isDeleting ? '...' : 'Oui' }}
      </button>
      <button class="confirm-no" @click="cancelConfirmation" :disabled="isDeleting">
        Non
      </button>
    </div>
  </div>
</template>

<style scoped>
.delete-habit {
  display: flex;
  align-items: center;
}

.delete-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.delete-btn:hover {
  background: #fee2e2;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 0.3rem 0.5rem;
}

.confirm-text {
  color: #991b1b;
  white-space: nowrap;
}

.confirm-yes,
.confirm-no {
  border: none;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.confirm-yes {
  background: #dc2626;
  color: white;
}
.confirm-yes:hover {
  background: #b91c1c;
}

.confirm-no {
  background: #e5e5e5;
  color: #333;
}
.confirm-no:hover {
  background: #d4d4d4;
}
</style>
