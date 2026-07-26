import { API_URL } from '@/config'

export async function addNewHabit(name, timeCoeff, difficultyCoeff, importanceCoeff) {
  const response = await fetch(`${API_URL}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      time_coeff: timeCoeff,
      difficulty_coeff: difficultyCoeff,
      importance_coeff: importanceCoeff
    })
  })
  if (!response.ok) throw new Error("Erreur lors de l'ajout de l'habitude")
  return response.json()
}

export async function getAllHabits() {
  const response = await fetch(`${API_URL}/habits`)
  if (!response.ok) throw new Error("Erreur lors du chargement des habitudes")
  return response.json()
}
