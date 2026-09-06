<script setup lang="ts">
import { computed } from 'vue'
import { useQuestsStore } from '@/stores/questsStore'
import type { Quest } from '@/types/Quest'

const props = defineProps<{
  quest: Quest
  actualDate: string
}>()

const questsStore = useQuestsStore()

const questStatus = computed(
  () => questsStore.questsStatus[props.quest.quest_id]?.[props.actualDate],
)

async function toggleQuest() {
  if (!props.actualDate) return
  if (questStatus.value?.checked) {
    await questsStore.uncheckQuest(props.quest.quest_id, props.actualDate!)
  } else {
    await questsStore.checkQuest(props.quest.quest_id, props.actualDate!)
  }
}
</script>

<template>
  <div
    class="quest-row"
    :class="{
      'frequency-reached': questStatus?.frequency_reached,
      'frequency-not-reached': questStatus && !questStatus.frequency_reached,
    }"
  >
    <div>
      <div class="quest-name">{{ props.quest.name }}</div>
      <div class="quest-info">
        ⏱️ {{ props.quest.time_coeff }} | ⚡ {{ props.quest.difficulty_coeff }} | ❗
        {{ props.quest.importance_coeff }}
      </div>
      <div class="quest-info">🔥 {{ questStatus?.streak }}</div>
    </div>
    <div class="quest-check">
      <input type="checkbox" :checked="questStatus?.checked" @change="toggleQuest()" />
    </div>
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

.quest-row {
  display: grid;
  grid-template-columns: 0.7fr 0.2fr 0.1fr;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 6px;
}

.frequency-reached {
  background: #dcfce7;
}

.frequency-not-reached {
  background: #fef3c7;
}
</style>
