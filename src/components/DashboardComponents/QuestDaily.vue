<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import type { Quest } from '@/types/Quest'

const props = defineProps<{
  quest: Quest
  actualDate: string
}>()

const questsStore = useQuestsStore()

const isChecked = computed(() =>
  questsStore.isQuestCheckedOnDate(props.quest.quest_id, props.actualDate),
)

async function toggleQuest() {
  if (!props.actualDate) return
  if (isChecked.value) {
    await questsStore.uncheckQuest(props.quest.quest_id, props.actualDate!)
  } else {
    await questsStore.checkQuest(props.quest.quest_id, props.actualDate!)
  }
}

watch(
  () => props.actualDate,
  (newDate) => {
    questsStore.fetchAllCheckedQuestIdsDuringPeriod(newDate!, newDate!)
  },
  { immediate: true },
)
</script>

<template>
  <div class="quest-name">{{ props.quest.name }}</div>
  <div class="quest-info">
    ⏱️ {{ props.quest.time_coeff }} | ⚡ {{ props.quest.difficulty_coeff }} | ❗
    {{ props.quest.importance_coeff }}
  </div>
  <div class="quest-check">
    <input type="checkbox" :checked="isChecked" @change="toggleQuest()" />
  </div>
</template>

<style scoped>
.quest-info {
  font-size: 0.85rem;
  color: #666;
}

.quest-check {
  display: flex;
  justify-content: center;
}

.quest-check input[type='checkbox'] {
  width: 1.3rem;
  height: 1.3rem;
  cursor: pointer;
}
</style>
