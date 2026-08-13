export interface Arc {
  arc_id: number
  name: string
  description: string
}

export type ArcCreate = Omit<Arc, 'arc_id'>
