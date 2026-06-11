import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { profileService } from "../services/profileService"
import { streakService } from "../services/streakService"
import type { Profile } from "../types/Profile"

interface BMICategory {
    label: string
    color: string
    suggestions: string[]
}

interface UserProfileContextValue {
    profile: Profile | null
    streak: number
    updateProfile: (data: Partial<Profile>) => Promise<void>
    refreshStreak: () => Promise<void>
    calculateBMI: () => number | null
    getBMICategory: () => BMICategory | null
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null)

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [streak, setStreak] = useState(0)

    const loadProfileData = useCallback(async (userId: number) => {
        const [prof, str] = await Promise.all([
            profileService.get(userId),
            streakService.getCurrent(userId)
        ])
        setProfile(prof ?? null)
        setStreak(str ?? 0)
    }, [])

    useEffect(() => {
        if (user?.id) {
            loadProfileData(user.id)
        } else {
            setProfile(null)
            setStreak(0)
        }
    }, [user, loadProfileData])

    const updateProfile = async (data: Partial<Profile>) => {
        if (!user?.id) return
        await profileService.update(user.id, data)
        const prof = await profileService.get(user.id)
        setProfile(prof ?? null)
    }

    const refreshStreak = async () => {
        if (!user?.id) return
        const s = await streakService.getCurrent(user.id)
        setStreak(s)
    }

    const calculateBMI = useCallback(() => {
        if (!profile?.weight || !profile?.height) return null
        const h = profile.height / 100
        return Number((profile.weight / (h * h)).toFixed(1))
    }, [profile])

    const getBMICategory = useCallback((): BMICategory | null => {
        const bmi = calculateBMI()
        if (bmi === null) return null
        if (bmi < 18.5) {
            return {
                label: 'Underweight',
                color: '#60a5fa',
                suggestions: [
                    'Increase calorie intake with nutrient-dense foods',
                    'Focus on strength training to build muscle mass',
                    'Consult a nutritionist for a personalized meal plan'
                ]
            }
        }
        if (bmi < 25) {
            return {
                label: 'Normal',
                color: '#34d399',
                suggestions: [
                    'Maintain your current healthy habits',
                    'Continue balanced diet and regular exercise',
                    'Keep monitoring your progress'
                ]
            }
        }
        if (bmi < 30) {
            return {
                label: 'Overweight',
                color: '#fbbf24',
                suggestions: [
                    'Increase cardio workouts to 30+ min daily',
                    'Reduce processed foods and sugar intake',
                    'Track calories to maintain a slight deficit'
                ]
            }
        }
        return {
            label: 'Obese',
            color: '#f87171',
            suggestions: [
                'Consult a healthcare professional immediately',
                'Start with low-impact exercises like walking or swimming',
                'Focus on gradual, sustainable lifestyle changes'
            ]
        }
    }, [calculateBMI])

    return (
        <UserProfileContext.Provider value={{
            profile,
            streak,
            updateProfile,
            refreshStreak,
            calculateBMI,
            getBMICategory
        }}>
            {children}
        </UserProfileContext.Provider>
    )
}

export const useUserProfile = () => {
    const ctx = useContext(UserProfileContext)
    if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider')
    return ctx
}