import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { achievementService } from "../services/achievementService"
import { BADGES } from '../constants/badges'
import type { Achievement } from '../types/Achievement'
import type { Badge } from '../types/Badge'

interface AchievementContextValue {
    achievements: Achievement[]
    BADGES: Badge[]
    unlockAchievement: (badgeId: string) => Promise<void>
}

const AchievementContext = createContext<AchievementContextValue | null>(null)

export function AchievementProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [achievements, setAchievements] = useState<Achievement[]>([])

    const loadAchievements = useCallback(async (userId: number) => {
        const ach = await achievementService.getAll(userId)
        setAchievements(ach ?? [])
    }, [])

    useEffect(() => {
        if (user?.id) {
            loadAchievements(user.id)
        } else {
            setAchievements([])
        }
    }, [user, loadAchievements])

    const unlockAchievement = async (badgeId: string) => {
        if (!user?.id) return
        const exists = achievements.find(a => a.badgeId === badgeId)
        if (exists) return

        await achievementService.unlock(user.id, badgeId)
        const ach = await achievementService.getAll(user.id)
        setAchievements(ach)
    }

    return (
        <AchievementContext.Provider value={{
            achievements,
            BADGES,
            unlockAchievement
        }}>
            {children}
        </AchievementContext.Provider>
    )
}

export const useAchievement = () => {
    const ctx = useContext(AchievementContext)
    if (!ctx) throw new Error('useAchievement must be used within AchievementProvider')
    return ctx
}