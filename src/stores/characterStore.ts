import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as characterService from '@/services/characterService'
import type { CharacterStats } from '@/types/CharacterStats'

export const useCharacterStore = defineStore('characterStore', () => {

  const characterStats = ref<CharacterStats>()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCharacterStats() {
    loading.value = true
    try{
      characterStats.value = await characterService.fetchCharacterStats()
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    }
    finally {
      loading.value = false
    }
  }


  return {characterStats, fetchCharacterStats }
})
