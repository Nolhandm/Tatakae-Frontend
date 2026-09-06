import { API_URL } from '@/config'
import type { QuestCreate, QuestsStatusByDate } from '@/types/Quest'

export async function fetchQuests() {
  const response = await fetch(`${API_URL}/quests`)
  if (!response.ok) throw new Error('Erreur lors du chargement des quêtes')
  return response.json()
}

export async function createQuest(questCreate: QuestCreate) {
  const response = await fetch(`${API_URL}/quests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(questCreate),
  })
  if (!response.ok) throw new Error("Erreur lors de l'ajout de la quête")
  return response.json()
}
export async function getAllQuestsStatusDuringPeriod(
  startDate: string,
  endDate: string,
): Promise<Record<number, QuestsStatusByDate>> {
  const response = await fetch(
    `${API_URL}/quests/status?start_date=${startDate}&end_date=${endDate}`,
  )
  if (!response.ok) throw new Error('Erreur lors du chargement du statut des quêtes')
  return response.json()
}

export async function getQuestStatusDuringPeriod(
  questId: number,
  startDate: string,
  endDate: string,
): Promise<QuestsStatusByDate> {
  const response = await fetch(
    `${API_URL}/quests/${questId}/status?start_date=${startDate}&end_date=${endDate}`,
  )
  if (!response.ok) throw new Error('Erreur lors du chargement du statut de la quête')
  return response.json()
}

export async function checkQuest(questId: number, validationDate: string) {
  const response = await fetch(
    `${API_URL}/quests/${questId}/check?validation_date=${validationDate}`,
    {
      method: 'POST',
    },
  )
  if (!response.ok) throw new Error('Erreur lors de la validation')
  return response.json()
}

export async function uncheckQuest(questId: number, validationDate: string) {
  const response = await fetch(
    `${API_URL}/quests/${questId}/uncheck?validation_date=${validationDate}`,
    {
      method: 'POST',
    },
  )
  if (!response.ok) throw new Error("Erreur lors de l'annulation")
}

export async function deleteQuest(questId: number) {
  const response = await fetch(`${API_URL}/quests/${questId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Erreur lors de la suppression de la quête')
  return response.json()
}
