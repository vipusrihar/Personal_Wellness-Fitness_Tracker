import { db } from "../database/db";

export const hydrationService = {

    async add(userId: number, amount: number) {
        return db.hydration.add({ userId, amount, timestamp: new Date().toISOString() })
    },

    async getToday(userId: number) {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        return db.hydration.where('userId').equals(userId).filter(r => new Date(r.timestamp) >= today).toArray()
    },

    async delete(id: number) {
        return db.hydration.delete(id)
    }
}