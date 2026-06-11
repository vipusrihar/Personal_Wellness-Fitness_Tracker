import { db } from "../database/db";

export const workoutService = {

    async add(userId: number, data: any) {
        return db.workouts.add({ userId, ...data, timestamp: new Date().toISOString() })
    },

    async getToday(userId: number) {
        const today = new Date(); today.setHours(0, 0, 0, 0)

        return db.workouts.where('userId').equals(userId).filter(r => new Date(r.timestamp) >= today).toArray()
    },

    async getAll(userId: number) {
        return db.workouts.where('userId').equals(userId).reverse().sortBy('timestamp')
    },

    async delete(id: number) {
        return db.workouts.delete(id)
    }
}