import type { Badge } from "../types/Badge";

export const BADGES: Badge[] = [
    { id: 'first_login', label: 'First Steps', icon: '👟', desc: 'Logged in for the first time' },
    { id: 'first_workout', label: 'Iron Will', icon: '💪', desc: 'Completed your first workout' },
    { id: 'first_meal', label: 'Fuel Up', icon: '🥗', desc: 'Logged your first meal' },
    { id: 'hydration_goal', label: 'Hydrated', icon: '💧', desc: 'Met daily water goal' },
    { id: 'streak_3', label: 'On Fire', icon: '🔥', desc: '3-day streak' },
    { id: 'streak_7', label: 'Week Warrior', icon: '⚡', desc: '7-day streak' },
    { id: 'streak_30', label: 'Legend', icon: '🏆', desc: '30-day streak' },
    { id: 'weight_loss', label: 'Slimmer', icon: '📉', desc: 'Logged weight loss progress' },
    { id: 'calorie_goal', label: 'Disciplined', icon: '🎯', desc: 'Hit calorie goal 3 times' }
]