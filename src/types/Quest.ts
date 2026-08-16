export enum QuestFrequencyMode {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  OCCASIONAL = 'OCCASIONAL',
}

export interface Quest {
  quest_id: number
  name: string
  time_coeff: number
  difficulty_coeff: number
  importance_coeff: number
  arc_id: number | null
  frequency_mode: QuestFrequencyMode
  frequency: number
}

export type QuestCreate = Omit<Quest, 'quest_id'>
