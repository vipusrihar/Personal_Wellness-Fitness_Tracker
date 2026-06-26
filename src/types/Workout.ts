export interface Workout {
  id?: number
  userId: number
  exercise: string
  category: string
  sets: number | null
  reps: number | null
  duration: number | null
  timestamp: string
}
