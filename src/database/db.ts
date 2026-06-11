import Dexie, { type Table } from "dexie"
import type { User } from "../types/User"
import type { Profile } from "../types/Profile"
import type { Calorie } from "../types/Calorie"


export class FitTrackDatabase extends Dexie {

  users!: Table<User, number>

  profile!: Table<Profile, number>

  calories!: Table<Calorie, number>

  hydration!: Table<any, number>

  workouts!: Table<any, number>

  measurements!: Table<any, number>

  achievements!: Table<any, number>

  streaks!: Table<any, number>

  syncQueue!: Table<any, number>

  constructor() {

    super("FitTrackProDb")

    this.version(1).stores({

      users:
        "++id,username,email,createdAt",

      profile:
        "++id,&userId",

      calories:
        "++id,userId,timestamp",

      hydration:
        "++id,userId,timestamp",

      workouts:
        "++id,userId,timestamp",

      measurements:
        "++id,userId,timestamp",

      achievements:
        "++id,userId,badgeId",

      streaks:
        "++id,userId,date",

      syncQueue:
        "++id,userId,timestamp"

    })

  }

}

export const db = new FitTrackDatabase()