import { db } from "../database/db"

export const measurementService = {
    
    async add(userId: number, data: any) {
        return db.measurements.add({ userId, ...data, timestamp: new Date().toISOString() })
    },

    async getAll(userId: number) {
        return db.measurements.where('userId').equals(userId).sortBy('timestamp')
    },

    async delete(id: number) {
        return db.measurements.delete(id)
    }
}