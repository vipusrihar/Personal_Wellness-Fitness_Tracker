import axios from 'axios'

// TYPES & INTERFACES
export interface Quote {
  text: string
  author: string
}

export interface Exercise {
  name: string
  category: string
  muscles: string
}

interface CachedData<T> {
  data: T
  cachedAt: number
}

// FALLBACK DATA SOURCE
const FALLBACK_QUOTES: Quote[] = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Churchill" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" }
]

const FALLBACK_EXERCISES: Exercise[] = [
  { name: "Push-ups", category: "Strength", muscles: "Chest, Triceps, Shoulders" },
  { name: "Squats", category: "Strength", muscles: "Quads, Hamstrings, Glutes" },
  { name: "Deadlifts", category: "Strength", muscles: "Back, Hamstrings, Glutes" },
  { name: "Pull-ups", category: "Strength", muscles: "Back, Biceps" },
  { name: "Plank", category: "Core", muscles: "Core, Shoulders" },
  { name: "Burpees", category: "Cardio", muscles: "Full Body" },
  { name: "Lunges", category: "Strength", muscles: "Quads, Hamstrings, Glutes" },
  { name: "Mountain Climbers", category: "Cardio", muscles: "Core, Shoulders" },
  { name: "Bench Press", category: "Strength", muscles: "Chest, Triceps" },
  { name: "Overhead Press", category: "Strength", muscles: "Shoulders, Triceps" },
  { name: "Bicep Curls", category: "Strength", muscles: "Biceps" },
  { name: "Tricep Dips", category: "Strength", muscles: "Triceps" },
  { name: "Running", category: "Cardio", muscles: "Full Body" },
  { name: "Cycling", category: "Cardio", muscles: "Legs, Core" },
  { name: "Jump Rope", category: "Cardio", muscles: "Full Body" },
  { name: "Yoga Flow", category: "Flexibility", muscles: "Full Body" },
  { name: "Stretching", category: "Flexibility", muscles: "Full Body" },
  { name: "Crunches", category: "Core", muscles: "Abs" },
  { name: "Leg Raises", category: "Core", muscles: "Lower Abs" },
  { name: "Russian Twists", category: "Core", muscles: "Obliques" }
]

const QUOTES_CACHE_KEY = 'fittrack_quotes_cache'
const EXERCISES_CACHE_KEY = 'fittrack_exercises_cache'

// Cache Durations in milliseconds
const ONE_DAY_MS = 86400000
const SEVEN_DAYS_MS = 604800000

// API SERVICE
export const apiService = {
  /**
   * Fetches a list of quotes, caches them, and returns one random quote.
   * Uses an open public API endpoint to circumvent browser CORS restrictions.
   */
  async getQuote(): Promise<Quote> {
    try {
      const cached = localStorage.getItem(QUOTES_CACHE_KEY)
      if (cached) {
        const { data: quotes, cachedAt }: CachedData<Quote[]> = JSON.parse(cached)
        if (Date.now() - cachedAt < ONE_DAY_MS) {
          return quotes[Math.floor(Math.random() * quotes.length)]
        }
      }

      // Using a reliable CORS-compliant open API alternative
      const res = await axios.get<{ quotes: Array<{ quote: string; author: string }> }>(
        'https://dummyjson.com/quotes/limit/30', 
        { timeout: 5000 }
      )

      if (res.data?.quotes?.length) {
        const quotes: Quote[] = res.data.quotes.map(q => ({
          text: q.quote,
          author: q.author
        }))
        
        localStorage.setItem(QUOTES_CACHE_KEY, JSON.stringify({ data: quotes, cachedAt: Date.now() }))
        return quotes[Math.floor(Math.random() * quotes.length)]
      }
    } catch (error) {
      console.warn("Quote fetch failed, falling back to local storage defaults.", error)
    }

    // Direct fallback array execution
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
  },

  /**
   * Returns filtered or full list of exercises.
   * Checks local storage cache before parsing static elements.
   */
  async getExercises(query: string = ''): Promise<Exercise[]> {
    let exercisesList: Exercise[] = []

    try {
      const cached = localStorage.getItem(EXERCISES_CACHE_KEY)
      if (cached) {
        const { data: exercises, cachedAt }: CachedData<Exercise[]> = JSON.parse(cached)
        if (Date.now() - cachedAt < SEVEN_DAYS_MS) {
          exercisesList = exercises
        }
      }
    } catch (error) {
      console.error("Failed to parse cached exercises", error)
    }

    // If cache is missing/expired, seed it using our internal data array 
    // (Or replace this string URL with your live endpoint if needed later)
    if (!exercisesList.length) {
      exercisesList = FALLBACK_EXERCISES
      try {
        localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify({ data: exercisesList, cachedAt: Date.now() }))
      } catch (error) {
        console.error("Failed to write exercises cache to localStorage", error)
      }
    }

    // Handle filtering seamlessly
    const sanitizedQuery = query.trim().toLowerCase()
    return sanitizedQuery
      ? exercisesList.filter(e => e.name.toLowerCase().includes(sanitizedQuery))
      : exercisesList
  }
}