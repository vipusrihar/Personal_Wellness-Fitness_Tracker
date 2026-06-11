import { db } from "../database/db"

export const achievementService = {

    async getAll(userId: number) {
        return db.achievements.where('userId').equals(userId).toArray()
    },

    async unlock(userId: number, badgeId: string) {
        const existing = await db.achievements.where({ userId, badgeId }).first()
        if (!existing) return db.achievements.add({ userId, badgeId, unlockedAt: new Date().toISOString() })
    }
}