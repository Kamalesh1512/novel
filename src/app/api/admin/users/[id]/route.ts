import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminUser, hasPermission } from "@/lib/auth/auth-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/lib/auth";

interface ConfigProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: ConfigProps) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session?.user.id;
    const currentUser = await getAdminUser(currentUserId);

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_USERS_EDIT)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    console.log(body)

    await db
      .update(users)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating admin user:", error);
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: ConfigProps) {
  try {
    
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const currentUserId = session?.user.id;
    const currentUser = await getAdminUser(currentUserId);

    if (
      !currentUser ||
      !hasPermission(currentUser.permissions, PERMISSIONS.ADMIN_USERS_DELETE)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent deleting super admin or self
    if (id === currentUserId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const userToDelete = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (userToDelete.length > 0 && userToDelete[0].role === "super_admin") {
      return NextResponse.json(
        { error: "Cannot delete super admin account" },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json(
      { error: "Failed to delete admin user" },
      { status: 500 }
    );
  }
}
