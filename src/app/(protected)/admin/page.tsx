
"use client";

import { useEffect, useState } from "react";
import { AdminOverview } from "@/components/admin/admin-overview";
import { RecentOrders } from "@/components/admin/recent-order";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/admin/analytics`)
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(() =>
        setAnalytics({
          overview: {
            totalRevenue: 0,
            monthlyRevenue: 0,
            revenueGrowth: 0,
            totalOrders: 0,
            monthlyOrders: 0,
            totalCustomers: 0,
            totalProducts: 0,
          },
          topProducts: [],
          categoryStats: [],
          recentOrders: [],
        })
      );
  }, []);

  if (!analytics) {
    return <div>Loading dashboard…</div>;
  }

  const { overview } = analytics;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ letterSpacing: "2px" }}>Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your store admin panel.</p>
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{overview.totalRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">
              {overview.revenueGrowth >= 0 ? "+" : ""}
              {overview.revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        {/* other cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{overview.monthlyOrders} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs and orders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AdminOverview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={analytics.recentOrders || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
