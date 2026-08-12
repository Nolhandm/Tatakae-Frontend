import { API_URL } from '@/config'

export async function addNewQuest(name, timeCoeff, difficultyCoeff, importanceCoeff) {
  const response = await fetch(`${API_URL}/quests/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      time_coeff: timeCoeff,
      difficulty_coeff: difficultyCoeff,
      importance_coeff: importanceCoeff
    })
  })
  if (!response.ok) throw new Error("Erreur lors de l'ajout de la quête")
  return response.json()
}

export async function getAllQuests() {
  const response = await fetch(`${API_URL}/quests`)
  if (!response.ok) throw new Error("Erreur lors du chargement des quêtes")
  return response.json()
}

export async function getAllCheckedQuestIds(validationDate) {
  const response = await fetch(`${API_URL}/quests/checked?validation_date=${validationDate}`)
  if (!response.ok) throw new Error("Erreur lors du chargement des validations")
  return response.json()
}

export async function checkQuest(questId, validationDate) {
  const response = await fetch(`${API_URL}/quests/${questId}/check?validation_date=${validationDate}`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error("Erreur lors de la validation")
  return response.json()
}

export async function uncheckQuest(questId, validationDate) {
  const response = await fetch(`${API_URL}/quests/${questId}/check?validation_date=${validationDate}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error("Erreur lors de l'annulation")
}

export async function deleteQuest(questId){
  const response = await fetch(`${API_URL}/quests/${questId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error("Erreur lors de la suppression de la quête")
  return response.json()
}

