import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { auth } from "@/lib/auth";

// Default account settings
const defaultAccountSettings = {
  settings: {
    storeName: "NovelTissues - Babio Naturals",
    storeAddress: "65A KIADB HOOTAGALI Industrial Area",
    currency: "INR",
    timezone: "Asia/Kolkata",
    taxRate: 18,
  },
  contactInfo: {
    email: "",
    phoneNumber: "",
  },
  // shipping: {
  //   pickupPostcode: 570018,
  //   defaultWeight: 1.0,
  //   freeShippingThreshold: 999,
  // },
  // payments: {
  //   codEnabled: true,
  //   onlinePaymentEnabled: true,
  //   paymentGateway: "razorpay",
  //   razorpayKeyId: "",
  //   razorpayKeySecret: "",
  //   webhookSecret: "",
  // },
  // deals: {
  //   "scent-sational": 1499,
  //   "iconic-match": 899,
  //   "alma-affair": 1699,
  //   "lov-dor": 1499,
  //   "gift-set": 999,
  // },
};

// GET - Fetch settings (Modified to allow read access for all authenticated users)
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user[0]) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const currentUser = user[0];
    
    // Get settings from any admin user (since regular users might not have accountSettings)
    let accountSettings = defaultAccountSettings;
    let settingsSource = null;

    // First try to get settings from current user if they're admin
    if (["super_admin", "admin"].includes(currentUser.role) && currentUser.accountSettings) {
      try {
        const parsed = JSON.parse(currentUser.accountSettings);
        settingsSource = currentUser;
        accountSettings = {
          settings: { ...defaultAccountSettings.settings, ...(parsed.settings || {}) },
          contactInfo: {
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber || "",
          },
          // shipping: { ...defaultAccountSettings.shipping, ...(parsed.shipping || {}) },
          // payments: { ...defaultAccountSettings.payments, ...(parsed.payments || {}) },
          // deals: { ...defaultAccountSettings.deals, ...(parsed.deals || {}) },
        };
      } catch (e) {
        console.error("Error parsing current user account settings:", e);
      }
    }

    // If no settings found from current user, get from any admin
    if (!settingsSource) {
      const adminWithSettings = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.role, 'super_admin'),
            eq(users.role, 'admin')
          )
        )
        .limit(3);

      // Find an admin with complete settings
      for (const admin of adminWithSettings) {
        if (admin.accountSettings) {
          try {
            const adminSettings = JSON.parse(admin.accountSettings);
            if (adminSettings.settings) {
              settingsSource = admin;
              accountSettings = {
                settings: { ...defaultAccountSettings.settings, ...adminSettings.settings },
                contactInfo: {
                  email: currentUser.email, // Keep current user's contact info
                  phoneNumber: currentUser.phoneNumber || "",
                },
                // shipping: { ...defaultAccountSettings.shipping, ...(adminSettings.shipping || {}) },
                // payments: { ...defaultAccountSettings.payments, ...(adminSettings.payments || {}) },
                // deals: { ...defaultAccountSettings.deals, ...(adminSettings.deals || {}) },
              };
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }

    // If still no settings found, use defaults with current user's contact info
    if (!settingsSource) {
      accountSettings.contactInfo = {
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber || "",
      };
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        accountSettings,
        userRole: currentUser.role,
        isReadOnly: !["super_admin", "admin"].includes(currentUser.role),
      }
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (!user[0] || !["super_admin", "admin"].includes(user[0].role)) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { accountSettings } = body;

    if (!accountSettings) {
      return NextResponse.json({ success: false, error: "Account settings required" }, { status: 400 });
    }

    // Update current user's contact info and account settings
    const updateData = {
      email: accountSettings.contactInfo.email,
      phoneNumber: accountSettings.contactInfo.phoneNumber,
      accountSettings: JSON.stringify(accountSettings),
      updatedAt: new Date(),
    };

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id));

    // Check if any shared settings were updated
    const hasSharedSettings = accountSettings.settings || 
                             accountSettings.shipping || 
                             accountSettings.payments || 
                             accountSettings.deals;

    // If this user is updating shared settings, update all other admin users' shared settings
    if (hasSharedSettings) {
      const allAdmins = await db
        .select()
        .from(users)
        .where(
          or(
            eq(users.role, 'super_admin'),
            eq(users.role, 'admin')
          )
        );

      // Update shared settings for all other admins
      for (const admin of allAdmins) {
        if (admin.id !== session.user.id) {
          let adminAccountSettings = defaultAccountSettings;
          
          // Parse existing settings
          if (admin.accountSettings) {
            try {
              adminAccountSettings = JSON.parse(admin.accountSettings);
            } catch (e) {
              console.error("Error parsing admin settings:", e);
            }
          }

          // Update only the shared settings, keep personal data (contactInfo) intact
          if (accountSettings.settings) {
            adminAccountSettings.settings = accountSettings.settings;
          }
          
          // if (accountSettings.shipping) {
          //   adminAccountSettings.shipping = accountSettings.shipping;
          // }
          
          // if (accountSettings.payments) {
          //   adminAccountSettings.payments = accountSettings.payments;
          // }
          
          // if (accountSettings.deals) {
          //   adminAccountSettings.deals = accountSettings.deals;
          // }

          await db.update(users)
            .set({
              accountSettings: JSON.stringify(adminAccountSettings),
              updatedAt: new Date(),
            })
            .where(eq(users.id, admin.id));
        }
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}