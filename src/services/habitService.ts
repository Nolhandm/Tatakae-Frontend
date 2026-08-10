import { API_URL } from '@/config'

export async function addNewHabit(name, timeCoeff, difficultyCoeff, importanceCoeff) {
  const response = await fetch(`${API_URL}/habits/create`, {
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

export async function getAllCheckedHabitIds(validationDate) {
  const response = await fetch(`${API_URL}/habits/checked?validation_date=${validationDate}`)
  if (!response.ok) throw new Error("Erreur lors du chargement des validations")
  return response.json()
}

export async function checkHabit(habitId, validationDate) {
  const response = await fetch(`${API_URL}/habits/${habitId}/check?validation_date=${validationDate}`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error("Erreur lors de la validation")
  return response.json()
}

export async function uncheckHabit(habitId, validationDate) {
  const response = await fetch(`${API_URL}/habits/${habitId}/check?validation_date=${validationDate}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error("Erreur lors de l'annulation")
}

export async function deleteHabit(habitId){
  const response = await fetch(`${API_URL}/habits/${habitId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error("Erreur lors de la suppression de l'habitude")
  return response.json()
}

