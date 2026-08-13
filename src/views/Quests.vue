<script setup lang="ts">
import { ref } from 'vue'
import NewQuestForm from '../components/QuestsComponents/NewQuestForm.vue'
import QuestsTable from '@/components/QuestsComponents/QuestsTable.vue'
import NewArcForm from '@/components/QuestsComponents/NewArcForm.vue'
import ArcFilter from '@/components/QuestsComponents/ArcFilter.vue'
import Modal from '@/components/Modal.vue'

const showArcModal = ref(false)

</script>

<template>
  <div class="quests-header">
    <ArcFilter />
    <button class="new-arc-btn" @click="showArcModal = true">➕ Nouvel arc</button>
  </div>

  <QuestsTable />
  <NewQuestForm />

  <Modal :show="showArcModal" @close="showArcModal = false">
    <NewArcForm @created="showArcModal = false" />
  </Modal>
</template>

<style scoped>
.quests-header {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;
}

.new-arc-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.new-arc-btn:hover {
  background: #f5f5f5;
}
</style>
