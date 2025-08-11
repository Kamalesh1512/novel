import { db } from "@/lib/db";
import { Permission } from "@/lib/permissions";
import { users, adminRoles, userRoleAssignments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: Permission[];
  lastLoginAt?: Date;
}

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    // Get user basic info
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length || !["admin", "super_admin"].includes(user[0].role)) {
      return null;
    }

    const userData = user[0];

    // If super admin, return all permissions
    if (userData.role === "super_admin") {
      const { PERMISSIONS } = await import("@/lib/permissions");
      return {
        ...userData,
        name:userData.name as string,
        lastLoginAt: userData.lastLoginAt as Date,
        permissions: Object.values(PERMISSIONS),
      };
    }

    // Get user's role assignments and permissions
    const roleAssignments = await db
      .select({
        permissions: adminRoles.permissions,
      })
      .from(userRoleAssignments)
      .leftJoin(adminRoles, eq(userRoleAssignments.roleId, adminRoles.id))
      .where(eq(userRoleAssignments.userId, userId));

    // Combine all permissions from all roles
    const allPermissions = new Set<Permission>();
    roleAssignments.forEach((assignment) => {
      if (assignment.permissions) {
        const permissions = JSON.parse(assignment.permissions) as Permission[];
        permissions.forEach((permission) => allPermissions.add(permission));
      }
    });

    return {
      ...userData,
      name:userData.name as string,
      lastLoginAt: userData.lastLoginAt as Date,
      permissions: Array.from(allPermissions),
    };
  } catch (error) {
    console.error("Error getting admin user:", error);
    return null;
  }
}

export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

// Middleware function to check permissions
export function requirePermission(permission: Permission) {
  return async (adminUser: AdminUser | null) => {
    if (!adminUser) {
      throw new Error("Unauthorized: No admin user found");
    }

    if (!hasPermission(adminUser.permissions, permission)) {
      throw new Error(`Unauthorized: Missing permission ${permission}`);
    }

    return true;
  };
}
