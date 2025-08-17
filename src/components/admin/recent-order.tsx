import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  customerName: string
  customerEmail: string
}

interface RecentOrdersProps {
  orders: Order[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "processing":
      return "default"
    case "shipped":
      return "outline"
    case "delivered":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders || orders.length === 0) {
    return <div className="text-center text-muted-foreground py-4">No recent orders found</div>
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>
              {order.customerName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customerName || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
          </div>
          <div className="ml-auto text-right space-y-1">
            <div className="font-medium">₹{order.total.toLocaleString("en-IN")}</div>
            <Badge variant={getStatusColor(order.status)} className="text-xs">
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
