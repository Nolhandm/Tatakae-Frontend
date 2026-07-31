import { API_URL } from '@/config'

export async function getCharacterStats() {
  const response = await fetch(`${API_URL}/character/stats`)
  if (!response.ok) throw new Error("Erreur lors du chargement des stats du personnage")
  return response.json()
}
