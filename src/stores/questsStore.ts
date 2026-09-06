import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Quest, QuestCreate, QuestStatus } from '@/types/Quest'
import * as questsService from '@/services/questsService'
import { useCharacterStore } from '@/stores/characterStore'

export const useQuestsStore = defineStore('questsStore', () => {
  const quests = ref<Quest[]>([])
  const questsStatus = ref<Record<number, Record<string, QuestStatus>>>({})
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
  async function fetchAllQuestsStatusDuringPeriod(startDate: string, endDate: string) {
    loading.value = true
    try {
      const data = await questsService.getAllQuestsStatusDuringPeriod(startDate, endDate)
      questsStatus.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuestsStatusDuringPeriod(
    questId: number,
    startDate: string,
    endDate: string,
  ) {
    loading.value = true
    try {
      const data = await questsService.getQuestStatusDuringPeriod(questId, startDate, endDate)
      questsStatus.value[questId] = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    } finally {
      loading.value = false
    }
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
    const data = await questsService.getQuestStatusDuringPeriod(
      questId,
      validationDate,
      validationDate,
    )
    questsStatus.value[questId] = data
    await characterStore.fetchCharacterStats()
  }

  async function uncheckQuest(questId: number, validationDate: string) {
    await questsService.uncheckQuest(questId, validationDate)
    const data = await questsService.getQuestStatusDuringPeriod(
      questId,
      validationDate,
      validationDate,
    )
    questsStatus.value[questId] = data
    await characterStore.fetchCharacterStats()
  }

  return {
    quests,
    loading,
    error,
    fetchQuests,
    createQuest,
    deleteQuest,
    checkQuest,
    uncheckQuest,
    fetchAllQuestsStatusDuringPeriod,
    fetchQuestsStatusDuringPeriod,
    questsStatus,
  }
})
