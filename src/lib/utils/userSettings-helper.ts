// utils/userSettings.ts
import { db } from "@/lib/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { UserSettings } from "../constants/types";


interface userDetails{
name:string,
email :string,
phone:string,
settings:string
}

export async function getUserSettings(
  userId: string
): Promise<userDetails | null> {
  try {
    const result = await db
      .select({ name:users.name , email:users.email ,phone:users.phoneNumber , settings: users.accountSettings })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) return null;

    if (result[0]) {
      return result[0] as userDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}
