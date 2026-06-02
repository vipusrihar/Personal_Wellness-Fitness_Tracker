import { db } from "../database/db"

export const syncQueueService = {
    async add(userId: number, action: any, table: any, data: any) {
        return db.syncQueue.add({ userId, action, table, data, timestamp: new Date().toISOString() })
    },


    async getAll(userId: number) {
        return db.syncQueue.where('userId').equals(userId).toArray()
    },


    async remove(id: number) {
        return db.syncQueue.delete(id)
    }
}
