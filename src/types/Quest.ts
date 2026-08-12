export interface Quest {
  quest_id: number
  name: string
  time_coeff: number
  difficulty_coeff: number
  importance_coeff: number
}

export type QuestCreate = Omit<Quest, 'quest_id'>
