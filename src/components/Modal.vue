<script setup lang="ts">
defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click.self="emit('close')">
        <div class="modal-panel">
          <button class="modal-close" @click="emit('close')">✕</button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end; /* panneau collé à droite */
  z-index: 1000;
}

.modal-panel {
  position: relative;
  width: 320px;
  max-width: 90vw;
  height: 100%;
  background: white;
  padding: 1.5rem;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-panel {
  transition: transform 0.25s ease;
}
.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: translateX(100%);
}
</style>
