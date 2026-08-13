import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Quest , QuestCreate} from '@/types/Quest'
import * as questsService from '@/services/questsService'

export const useQuestsStore = defineStore('questsStore', () => {
  const quests = ref<Quest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)


  async function fetchQuests() {
    loading.value = true
    try {
      quests.value = await questsService.fetchQuests()
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    }
    finally {
      loading.value = false
    }
  }

  async function createQuest(questCreate: QuestCreate) {
    const newQuest = await questsService.createQuest(questCreate)
    quests.value.push(newQuest)
  }

  async function deleteQuest(questId: number) {
    await questsService.deleteQuest(questId)
    quests.value = quests.value.filter(q => q.quest_id !== questId)
  }

  return {quests, loading, error, fetchQuests, createQuest, deleteQuest}
})
