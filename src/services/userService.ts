import { db } from "../database/db"
import type { User } from "../types/User"

// Helper function to generate a SHA-256 hash using the native Web Crypto API
async function hashPassword(password: string): Promise<string> {
   const encoder = new TextEncoder()
   const data = encoder.encode(password)
   const hashBuffer = await crypto.subtle.digest("SHA-256", data)
   
   // Convert the ArrayBuffer to a hex string
   const hashArray = Array.from(new Uint8Array(hashBuffer))
   return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export const userService = {

   async create(username: string, password: string, email: string): Promise<number> {

      const existing = await db.users.where("username").equals(username).first()

      if (existing) throw new Error("Username exists")

      // Hash the password before saving it to Dexie
      const hashedPassword = await hashPassword(password)

      const user: User = { 
         username, 
         password: hashedPassword, 
         email, 
         createdAt: new Date().toISOString() 
      }

      const id = await db.users.add(user)

      return id

   },

   async login(username: string, password: string): Promise<User> {
      const user = await db.users.where("username").equals(username).first()
      
      // Hash the incoming input password to compare it against the stored hash
      const inputHash = await hashPassword(password)

      if (!user || user.password !== inputHash) throw new Error("Invalid credentials")
      return user

   },

   getById(id: number) {

      return db.users.get(id)

   }

}