import { db } from "../database/db"
import { achievementService } from "./achievementService"
import { calorieService } from "./calorieService"
import { hydrationService } from "./hydrationService"
import { measurementService } from "./measurement"
import { profileService } from "./profileService"
import { workoutService } from "./workoutService"

export const exportData = async (userId: number) => {

    const [profile, calories, hydration, workouts, measurements, achievements] = await Promise.all([
        profileService.get(userId),
        calorieService.getAll(userId),
        hydrationService.getToday(userId),
        workoutService.getAll(userId),
        measurementService.getAll(userId),
        achievementService.getAll(userId)
    ])

    return {
        profile, calories, hydration, workouts, measurements, achievements, exportedAt: new Date().toISOString()
    }
}

export const resetData = async (userId: number) => {

    await Promise.all([
        db.calories.where('userId').equals(userId).delete(),
        db.hydration.where('userId').equals(userId).delete(),
        db.workouts.where('userId').equals(userId).delete(),
        db.measurements.where('userId').equals(userId).delete(),
        db.achievements.where('userId').equals(userId).delete(),
        db.streaks.where('userId').equals(userId).delete()
    ])

}
