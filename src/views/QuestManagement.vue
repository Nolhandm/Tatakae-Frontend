<script setup lang="ts">
import { ref } from 'vue'
import NewQuestForm from '@/components/QuestManagementComponents/NewQuestForm.vue'
import QuestsTable from '@/components/QuestManagementComponents/QuestsTable.vue'
import NewArcForm from '@/components/QuestManagementComponents/NewArcForm.vue'
import ArcFilter from '@/components/QuestManagementComponents/ArcFilter.vue'
import Modal from '@/components/Modal.vue'

const showArcModal = ref(false)
const showQuestModal = ref(false)
</script>

<template>
  <div class="quests-page">
    <!-- Ligne du haut : filtre à gauche, bouton "Nouvel arc" à droite -->
    <div class="filter-row">
      <ArcFilter />
      <button class="btn-secondary" @click="showArcModal = true">➕ Nouvel arc</button>
    </div>

    <QuestsTable />

    <!-- Bouton "Nouvelle quête" juste sous le tableau -->
    <button class="btn-primary add-quest-btn" @click="showQuestModal = true">
      ➕ Nouvelle quête
    </button>

    <Modal :show="showArcModal" @close="showArcModal = false">
      <NewArcForm @created="showArcModal = false" />
    </Modal>

    <Modal :show="showQuestModal" @close="showQuestModal = false">
      <NewQuestForm @created="showQuestModal = false" />
    </Modal>
  </div>
</template>

<style scoped>
.quests-page {
  max-width: 900px;
  margin: 0 auto;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
}
.btn-secondary:hover {
  background: #4338ca;
}

.btn-primary {
  padding: 0.5rem 1.25rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary:hover {
  background: #4338ca;
}

.add-quest-btn {
  margin-top: 1rem;
}
</style>
