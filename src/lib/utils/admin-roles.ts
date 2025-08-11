// lib/utils/roleUtils.ts
import { DEFAULT_ROLES, Permission, PERMISSIONS } from "@/lib/permissions";

export interface AdminUserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Initialize default roles in the database
 * This should be called during application setup or migration
 */
export async function initializeDefaultRoles(): Promise<AdminUserRole[]> {
  const defaultRoles: AdminUserRole[] = [];

  for (const [key, roleData] of Object.entries(DEFAULT_ROLES)) {
    const role: AdminUserRole = {
      id: key.toLowerCase(),
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    defaultRoles.push(role);
  }

  return defaultRoles;
}

/**
 * Get role permissions by role name
 */
export function getRolePermissions(roleName: keyof typeof DEFAULT_ROLES): Permission[] {
  return DEFAULT_ROLES[roleName].permissions;
}

/**
 * Check if a user has specific permission
 */
export function hasPermission(userPermissions: Permission[], requiredPermission: Permission): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has any of the required permissions
 */
export function hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if a user has all required permissions
 */
export function hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

/**
 * Get user's effective permissions from multiple roles
 */
export function mergeRolePermissions(roles: AdminUserRole[]): Permission[] {
  const allPermissions = new Set<Permission>();
  
  roles.forEach(role => {
    role.permissions.forEach(permission => {
      allPermissions.add(permission);
    });
  });

  return Array.from(allPermissions);
}

/**
 * Validate role permissions against available permissions
 */
export function validateRolePermissions(permissions: Permission[]): { valid: boolean; invalid: Permission[] } {
  const validPermissions = Object.values(PERMISSIONS);
  const invalid = permissions.filter(permission => !validPermissions.includes(permission));
  
  return {
    valid: invalid.length === 0,
    invalid
  };
}

/**
 * Get recommended roles for common use cases
 */
export function getRecommendedRoles(): { [key: string]: keyof typeof DEFAULT_ROLES } {
  return {
    storeOwner: 'SUPER_ADMIN',
    generalManager: 'STORE_MANAGER',
    productManager: 'PRODUCT_MANAGER',
    orderProcessor: 'OPERATIONS_MANAGER',
    marketingTeam: 'MARKETING_MANAGER',
    supportAgent: 'CUSTOMER_SERVICE',
    contentModerator: 'CONTENT_MODERATOR',
    dataAnalyst: 'ANALYST',
    inventoryClerk: 'INVENTORY_MANAGER'
  };
}

/**
 * Get role hierarchy for permission inheritance
 */
export function getRoleHierarchy(): { [key: string]: number } {
  return {
    SUPER_ADMIN: 10,
    STORE_MANAGER: 8,
    OPERATIONS_MANAGER: 6,
    PRODUCT_MANAGER: 6,
    MARKETING_MANAGER: 5,
    ANALYST: 4,
    INVENTORY_MANAGER: 3,
    CUSTOMER_SERVICE: 2,
    CONTENT_MODERATOR: 1
  };
}

/**
 * Check if a user can manage another user based on role hierarchy
 */
export function canManageUser(managerRole: string, targetRole: string): boolean {
  const hierarchy = getRoleHierarchy();
  const managerLevel = hierarchy[managerRole] || 0;
  const targetLevel = hierarchy[targetRole] || 0;
  
  return managerLevel > targetLevel;
}

/**
 * Format permission name for display
 */
export function formatPermissionName(permission: Permission): string {
  return permission
    .replace(/[_:]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Group permissions by category
 */
export function groupPermissionsByCategory(permissions: Permission[]): { [category: string]: Permission[] } {
  const grouped: { [category: string]: Permission[] } = {};
  
  permissions.forEach(permission => {
    const category = permission.split(':')[0];
    const categoryName = category
      .replace(/[_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    if (!grouped[categoryName]) {
      grouped[categoryName] = [];
    }
    grouped[categoryName].push(permission);
  });

  return grouped;
}


// Helper function to determine the first available admin page based on permissions
export function getFirstAvailablePage(permissions: string[]): string | null {
  const pagePermissionMap = [
    { page: "/admin/analytics", permission: "analytics:view" },
    { page: "/admin/products", permission: "products:view" },
    { page: "/admin/orders", permission: "orders:view" },
    { page: "/admin/customers", permission: "customers:view" },
    { page: "/admin/categories", permission: "categories:view" },
    { page: "/admin/banners", permission: "banners:view" },
    { page: "/admin/coupons", permission: "coupons:view" },
    { page: "/admin/reviews", permission: "reviews:view" },
    { page: "/admin/settings", permission: "settings:view" },
    { page: "/admin/admin-users", permission: "admin_users:view" },
  ];

  for (const { page, permission } of pagePermissionMap) {
    if (permissions.includes(permission)) {
      return page;
    }
  }

  return null;
}