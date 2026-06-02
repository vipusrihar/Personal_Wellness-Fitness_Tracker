import { db } from "../database/db"

export const streakService = {
    async getLatest(userId: number) {
        const all = await db.streaks.where('userId').equals(userId).sortBy('date')
        return all[all.length - 1] || null
    },


    async update(userId: number) {
        const today = new Date().toISOString().split('T')[0]
        const latest = await streakService.getLatest(userId)
        if (latest?.date === today) return latest
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
        const yDate = yesterday.toISOString().split('T')[0]
        const count = latest?.date === yDate ? (latest.count + 1) : 1
        return db.streaks.add({ userId, date: today, count })
    },


    async getCurrent(userId: number) {
        const latest = await streakService.getLatest(userId)
        if (!latest) return 0
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
        const yDate = yesterday.toISOString().split('T')[0]
        if (latest.date === today || latest.date === yDate) return latest.count
        return 0
    }
}