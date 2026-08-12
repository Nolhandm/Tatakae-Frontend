import { API_URL } from '@/config'
import type { QuestCreate } from '@/types/Quest'

export async function fetchQuests() {
  const response = await fetch(`${API_URL}/quests`)
  if (!response.ok) throw new Error("Erreur lors du chargement des quêtes")
  return response.json()
}

export async function createQuest(questCreate: QuestCreate) {
  const response = await fetch(`${API_URL}/quests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questCreate)
  })
  if (!response.ok) throw new Error("Erreur lors de l'ajout de la quête")
  return response.json()
}

export async function getAllCheckedQuestIdsAtDate(validationDate:string) {
  const response = await fetch(`${API_URL}/quests/checked?validation_date=${validationDate}`)
  if (!response.ok) throw new Error("Erreur lors du chargement des validations")
  return response.json()
}

export async function checkQuest(questId:number, validationDate:string) {
  const response = await fetch(`${API_URL}/quests/${questId}/check?validation_date=${validationDate}`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error("Erreur lors de la validation")
  return response.json()
}

export async function uncheckQuest(questId:number, validationDate:string) {
  const response = await fetch(`${API_URL}/quests/${questId}/uncheck?validation_date=${validationDate}`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error("Erreur lors de l'annulation")
}

export async function deleteQuest(questId:number){
  const response = await fetch(`${API_URL}/quests/${questId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error("Erreur lors de la suppression de la quête")
  return response.json()
}

