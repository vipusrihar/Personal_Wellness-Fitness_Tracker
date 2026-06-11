import { db } from "../database/db";
import type { Calorie } from "../types/Calorie";

export const calorieService = {
  async add(userId: number, meal: string, category: string, calories: number): Promise<number> {
    return db.calories.add({ userId, meal, category, calories, timestamp: new Date().toISOString() });
  },

  async getToday(userId: number): Promise<Calorie[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return db.calories.where('userId').equals(userId).filter(r => new Date(r.timestamp) >= today).toArray();
  },

  async getAll(userId: number): Promise<Calorie[]> {
    return db.calories.where('userId').equals(userId).reverse().sortBy('timestamp');
  },

  async delete(id: number): Promise<void> {
    return db.calories.delete(id);
  },

  async update(id: number, data: Partial<Calorie>): Promise<number> {
    return db.calories.update(id, data);
  }
};