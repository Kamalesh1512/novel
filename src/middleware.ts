import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { getFirstAvailablePage } from "./lib/utils/admin-roles";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const { pathname } = req.nextUrl;
  const isProtectedRoute = pathname.startsWith("/admin");
  const role = token?.role;
  const permissions: string[] = (token?.permissions as []) || [];

  // Redirect unauthenticated users to sign in
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Handle authenticated admin users
  if (token && isProtectedRoute) {
    // Redirect admin users from /admin to /admin/analytics
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.redirect(new URL("/admin/analytics", req.url));
    }

    // Full access for super admin
    if (role === "super_admin") {
      return NextResponse.next();
    }

    // Define permission requirements per admin section
    const pathPermissionMap: Record<string, string> = {
      "/admin/analytics": "analytics:view",
      "/admin/admin-users": "admin_users:view",
      "/admin/banners": "banners:view",
      "/admin/categories": "categories:view",
      "/admin/coupons": "coupons:view",
      "/admin/customers": "customers:view",
      "/admin/orders": "orders:view",
      "/admin/products": "products:view",
      "/admin/reviews": "reviews:view",
      "/admin/settings": "settings:view",
    };

    // Check permissions for specific admin paths
    for (const path in pathPermissionMap) {
      if (
        pathname.startsWith(path) &&
        !permissions.includes(pathPermissionMap[path])
      ) {
        // Redirect to first available page based on permissions
        const availablePage = getFirstAvailablePage(permissions);
        if (availablePage) {
          return NextResponse.redirect(new URL(availablePage, req.url));
        } else {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    // If user has admin role but no specific permissions matched, check if they have any admin permissions
    if (role === "admin" && permissions.length === 0) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/products/:path*"],
};
