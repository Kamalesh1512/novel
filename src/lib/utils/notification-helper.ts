// utils/notification-helpers.ts
export async function sendOrderPlacedNotification(
  orderData: any,
  customerSettings: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/notifications/order-placed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            email: customerSettings.email,
            name: customerSettings.name,
            phone: customerSettings.phone,
            accountSettings: customerSettings.settings,
          },
          order: {
            orderNumber: orderData.orderNumber,
            createdAt: orderData.createdAt,
            total: orderData.total,
            currency: orderData.currency || "INR",
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
            estimatedDelivery: orderData.estimatedDelivery,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send order notification");
    }

    const result = await response.json();
    console.log("Order notifications sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending order notification:", error);
    throw error;
  }
}

export async function sendPaymentSuccessNotification(
  orderData: any,
  paymentData: any,
  customerSettings: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/notifications/payment-success`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            email: customerSettings.email,
            name: customerSettings.name,
            phone: customerSettings.phone,
            accountSettings: customerSettings.settings,
          },
          order: {
            orderNumber: orderData.orderNumber,
            createdAt: orderData.createdAt,
            total: orderData.total,
            currency: orderData.currency || "₹",
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
          },
          payment: {
            paymentId: paymentData.id,
            paymentMethod: paymentData.method,
            amount: paymentData.amount,
            currency: paymentData.currency || "₹",
            transactionDate: paymentData.createdAt,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send payment notification");
    }

    const result = await response.json();
    console.log("Payment notifications sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending payment notification:", error);
    throw error;
  }
}

export async function sendOrderDeliveredNotification(
  orderData: any,
  customerSettings: any
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/notifications/order-delivered`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            email: customerSettings.email,
            name: customerSettings.name,
            phone: customerSettings.phone,
            accountSettings: customerSettings.settings,
          },
          order: {
            orderNumber: orderData.orderNumber,
            orderDate: orderData.createdAt,
            total: orderData.total,
            currency: orderData.currency || "INR",
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send delivery notification");
    }

    const result = await response.json();
    console.log("Delivery notifications sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending delivery notification:", error);
    throw error;
  }
}
