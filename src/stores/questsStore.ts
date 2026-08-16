import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Quest, QuestCreate } from '@/types/Quest'
import * as questsService from '@/services/questsService'
import { useCharacterStore } from '@/stores/characterStore'

export const useQuestsStore = defineStore('questsStore', () => {
  const quests = ref<Quest[]>([])
  const checkedQuestIdsByDate = ref<Record<string, Set<number>>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const characterStore = useCharacterStore()

  async function fetchQuests() {
    loading.value = true
    try {
      quests.value = await questsService.fetchQuests()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  async function fetchAllCheckedQuestIdsDuringPeriod(startDate: string, endDate: string) {
    loading.value = true
    try {
      const data = await questsService.getCheckedQuestIdsDuringPeriod(startDate, endDate)
      const converted: Record<string, Set<number>> = {}
      for (const [date, ids] of Object.entries(data)) {
        converted[date] = new Set(ids)
      }
      checkedQuestIdsByDate.value = converted
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  function isQuestCheckedOnDate(questId: number, date: string): boolean {
    return checkedQuestIdsByDate.value[date]?.has(questId) ?? false
  }

  async function createQuest(questCreate: QuestCreate) {
    const newQuest = await questsService.createQuest(questCreate)
    quests.value.push(newQuest)
  }

  async function deleteQuest(questId: number) {
    await questsService.deleteQuest(questId)
    quests.value = quests.value.filter((q) => q.quest_id !== questId)
  }

  async function checkQuest(questId: number, validationDate: string) {
    await questsService.checkQuest(questId, validationDate)
    checkedQuestIdsByDate.value[validationDate]?.add(questId)
    // Force reactivity
    checkedQuestIdsByDate.value = { ...checkedQuestIdsByDate.value }

    await characterStore.fetchCharacterStats()
  }

  async function uncheckQuest(questId: number, validationDate: string) {
    await questsService.uncheckQuest(questId, validationDate)
    checkedQuestIdsByDate.value[validationDate]?.delete(questId)
    // Force reactivity
    checkedQuestIdsByDate.value = { ...checkedQuestIdsByDate.value }

    await characterStore.fetchCharacterStats()
  }

  return {
    quests,
    loading,
    error,
    checkedQuestIdsByDate,
    fetchQuests,
    createQuest,
    deleteQuest,
    fetchAllCheckedQuestIdsDuringPeriod,
    checkQuest,
    uncheckQuest,
    isQuestCheckedOnDate,
  }
})
