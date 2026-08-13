export interface Quest {
  quest_id: number
  name: string
  time_coeff: number
  difficulty_coeff: number
  importance_coeff: number
  arc_id: number | null
}

export type QuestCreate = Omit<Quest, 'quest_id'>
