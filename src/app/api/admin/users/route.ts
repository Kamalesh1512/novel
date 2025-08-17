import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userRoleAssignments } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getAdminUser, hasPermission } from "@/lib/auth/auth-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session?.user.id;
    const currentUser = await getAdminUser(currentUserId);

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_USERS_VIEW)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(inArray(users.role, ["admin", "super_admin"]));

    // Get permissions for each user
    const usersWithPermissions = await Promise.all(
      adminUsers.map(async (user) => {
        const userWithPermissions = await getAdminUser(user.id);
        return {
          ...user,
          permissions: userWithPermissions?.permissions || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithPermissions,
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session?.user.id;
    const currentUser = await getAdminUser(currentUserId);

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_USERS_CREATE)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, email, password, roleIds } = await request.json();

    if (!name || !email || !password || !roleIds.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: "admin",
        status: "active",
      })
      .returning();

    // Assign roles
    const roleAssignments = roleIds.map((roleId: string) => ({
      userId: newUser[0].id,
      roleId,
      assignedBy: currentUserId,
    }));

    await db.insert(userRoleAssignments).values(roleAssignments);

    return NextResponse.json({
      success: true,
      user: newUser[0],
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
