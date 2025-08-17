import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminRoles, userRoleAssignments } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { getAdminUser, hasPermission } from "@/lib/auth/auth-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session?.user.id;
    const currentUser = await getAdminUser(currentUserId);

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_ROLES_MANAGE)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const roles = await db.select().from(adminRoles);

    // Get user count for each role
    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await db
          .select({ count: count() })
          .from(userRoleAssignments)
          .where(eq(userRoleAssignments.roleId, role.id));

        return {
          ...role,
          permissions: JSON.parse(role.permissions),
          userCount: userCount[0]?.count || 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      roles: rolesWithUserCount,
    });
  } catch (error) {
    console.error("Error fetching admin roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin roles" },
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

    console.log("user is :",currentUser)

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_ROLES_MANAGE)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, description, permissions } = await request.json();

    if (!name || !permissions.length) {
      return NextResponse.json(
        { error: "Name and permissions are required" },
        { status: 400 }
      );
    }

    const newRole = await db
      .insert(adminRoles)
      .values({
        name,
        description,
        permissions: JSON.stringify(permissions),
        createdBy: currentUserId,
      })
      .returning();

    return NextResponse.json({
      success: true,
      role: newRole[0],
    });
  } catch (error) {
    console.error("Error creating admin role:", error);
    return NextResponse.json(
      { error: "Failed to create admin role" },
      { status: 500 }
    );
  }
}
