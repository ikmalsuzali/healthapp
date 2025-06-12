import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { db } from "../db"
import {
  profiles,
  users,
  type NewProfile,
  type NewUser,
  type User,
} from "../db/schema"

export interface CreateUserInput {
  email: string
  password: string
  name?: string
}

export interface CreateUserResponse {
  success: boolean
  user?: User
  error?: string
}

export async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResponse> {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    })

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 12)

    // Create user
    const userId = nanoid()
    const newUser: NewUser = {
      id: userId,
      email: input.email,
      password: hashedPassword,
      name: input.name || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const [user] = await db.insert(users).values(newUser).returning()

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      success: false,
      error: "Failed to create user",
    }
  }
}

export async function createUserProfile(
  userId: string,
  profileData: Partial<NewProfile>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const profileId = nanoid()
    const newProfile: NewProfile = {
      id: profileId,
      userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(profiles).values(newProfile)

    return { success: true }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return {
      success: false,
      error: "Failed to create user profile",
    }
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return undefined
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  } catch (error) {
    console.error("Error fetching user by id:", error)
    return undefined
  }
}

export async function getUserWithProfile(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        profile: true,
      },
    })
    return user
  } catch (error) {
    console.error("Error fetching user with profile:", error)
    return undefined
  }
}
