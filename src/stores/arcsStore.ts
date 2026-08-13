import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Arc, ArcCreate } from '@/types/Arc'
import * as arcsService from '@/services/arcsService'

export const useArcsStore = defineStore('arcsStore', () => {

  const arcs = ref<Arc[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedArcId = ref<number | null>(null)

  async function fetchArcs() {
    loading.value = true
    try {
      arcs.value = await arcsService.fetchArcs()
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    }
    finally {
      loading.value = false
    }
  }

  async function createArc(arcCreate: ArcCreate) {
    const newArc = await arcsService.createArc(arcCreate)
    arcs.value.push(newArc)
  }

  async function deleteArc(arcId: number) {
    //await arcsService.deleteArc(arcId)
    arcs.value = arcs.value.filter(q => q.arc_id !== arcId)
  }

  return {arcs, loading, error, fetchArcs, createArc, deleteArc, selectedArcId}
})
