import { API_URL } from '@/config'

export async function fetchCharacterStats() {
  const response = await fetch(`${API_URL}/character/stats`)
  if (!response.ok) throw new Error("Erreur lors du chargement des stats")
  return response.json()
}
