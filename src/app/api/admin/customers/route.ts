import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, like, or, desc, count, sum, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phoneNumber,
        role: users.role,
        createdAt: users.createdAt,
        image: users.image,
      })
      .from(users)
      .where(
        or(
          eq(users.role, "customer"),
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`),
            like(users.phoneNumber, `%${search}%`)
          )
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // let selectQuery = db
    //   .select({
    //     name: users.name,
    //     email: users.email,
    //     phoneNumber: users.phoneNumber,
    //   })
    //   .from(users);

    // if (search) {
    //   selectQuery = query.where(
    //     or(
    //       like(users.name, `%${search}%`),
    //       like(users.email, `%${search}%`),
    //       like(users.phoneNumber, `%${search}%`)
    //     )
    //   );
    // }

    const result = await query;

    // Get order statistics for each customer
    const customersWithStats = await Promise.all(
      result.map(async (customer) => {

        const stats = { orderCount: 0, totalSpent: "0" };

        return {
          ...customer,
          orderCount: stats.orderCount,
          totalSpent: Number.parseFloat(stats.totalSpent || "0"),
          status: stats.orderCount > 0 ? "active" : "inactive",
        };
      })
    );

    // Get total count for pagination
    const totalResult = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.role, "customer"));

    const total = totalResult.length;

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
