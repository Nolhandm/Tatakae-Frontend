import { API_URL } from '@/config'
import type { ArcCreate } from '@/types/Arc.ts'

export async function fetchArcs() {
  const response = await fetch(`${API_URL}/arcs`)
  if (!response.ok) throw new Error("Erreur lors du chargement des arcs")
  return response.json()
}

export async function createArc(arcCreate: ArcCreate) {
  const response = await fetch(`${API_URL}/arcs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arcCreate)
  })
  if (!response.ok) throw new Error("Erreur lors de l'ajout de la quête")
  return response.json()
}
