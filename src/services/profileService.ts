import { db } from "../database/db"
import type { Profile } from "../types/Profile"

export const profileService = {

    async create(userId: number, name: string) {

        const profile: Profile = {
            userId, name, age: null, gender: null, weight: null, height: null,
            goal: "maintain", waterGoal: 2500, calorieGoal: 2000

        }

        return db.profile.add(profile)

    },

    async get(userId: number) {
        return db.profile.where('userId').equals(userId).first()
    },


    async update(userId: number, data: Partial<Profile>) {
        const profile = await this.get(userId);
        if (profile) await db.profile.update(profile.id!, data)
    }
}
