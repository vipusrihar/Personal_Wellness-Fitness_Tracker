import { db } from "../database/db"
import type { User } from "../types/User"

export const userService = {

   async create(username: string, password: string, email: string): Promise<number> {

      const existing = await db.users.where("username").equals(username).first()

      if (existing) throw new Error("Username exists")

      const user: User = { username, password, email, createdAt: new Date().toISOString() }

      const id = await db.users.add(user)

      return id

   },

   async login(username: string, password: string): Promise<User> {

      const user = await db.users.where("username").equals(username).first()

      if (!user || user.password !== password) throw new Error("Invalid credentials")

      return user

   },

   getById(id: number) {

      return db.users.get(id)

   }

}