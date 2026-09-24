<script setup lang="ts">
import { ref } from 'vue'
import CharacterComponent from '@/components/CharacterComponent.vue'

const isOpen = ref(true)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <!-- Bouton flottant toujours visible -->
  <button
    class="drawer-toggle"
    @click="toggle"
    :class="{ 'is-open': isOpen }"
    aria-label="Ouvrir la fiche personnage"
  >
    🧙
  </button>

  <!-- Volet -->
  <Transition name="slide">
    <aside v-if="isOpen" class="drawer-panel">
      <button class="drawer-close" @click="close" aria-label="Fermer">✕</button>
      <CharacterComponent />
    </aside>
  </Transition>
</template>

<style scoped>
.drawer-toggle {
  position: fixed;
  top: calc(var(--navbar-height) + (100vh - var(--navbar-height)) / 2);
  left: 0;
  transform: translateY(-50%);
  z-index: 100;
  width: 3rem;
  height: 3rem;
  border-radius: 0% 50% 50% 0%;
  border: 1px solid #ddd;
  border-left: none;
  background: white;
  font-size: 1.4rem;
  cursor: pointer;
  transition: 0.3s ease;
}
.drawer-toggle.is-open {
  left: 319px;
}

.drawer-panel {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  height: calc(100vh - var(--navbar-height));
  width: 320px;
  max-width: 90vw;
  background: white;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
  z-index: 99;
  overflow-y: auto;
  padding: 1rem;
  border-right: 1px solid #eee;
}

.drawer-close {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
