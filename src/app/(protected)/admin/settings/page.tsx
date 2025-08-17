"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Store,
  Truck,
  IndianRupee,
  Globe,
  Save,
  Shield,
  Eye,
  EyeOff,
  User,
  Package,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import {
  AccountSettings,
  AdminContactInfo,
  Settings,
} from "@/lib/constants/types";
import { LoadingScreen } from "@/components/global/loading";

interface SettingsData {
  accountSettings: AccountSettings;
  userRole: string;
}

export default function MultiAdminSettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    razorpaySecret: false,
    webhookSecret: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error", {
        description: "Failed to load settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Settings saved", {
          description: "Your store settings have been updated successfully.",
        });
        await fetchSettings();
      } else {
        throw new Error(result.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Error", {
        description: "New passwords do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Error", {
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/admin/settings/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password changed", {
          description: "Your password has been updated successfully.",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to change password",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to change password. Please try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const updateSettings = (
    key: keyof AccountSettings["settings"],
    value: any
  ) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            accountSettings: {
              ...prev.accountSettings,
              settings: { ...prev.accountSettings.settings, [key]: value },
            },
          }
        : null
    );
  };

  const updateContactInfo = (
    key: keyof AccountSettings["contactInfo"],
    value: string
  ) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            accountSettings: {
              ...prev.accountSettings,
              contactInfo: {
                ...prev.accountSettings.contactInfo,
                [key]: value,
              },
            },
          }
        : null
    );
  };

  const updateShipping = (
    key: keyof AccountSettings["shipping"],
    value: any
  ) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            accountSettings: {
              ...prev.accountSettings,
              shipping: { ...prev.accountSettings.shipping, [key]: value },
            },
          }
        : null
    );
  };
  const updatePayments = (
    key: keyof AccountSettings["payments"],
    value: any
  ) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            accountSettings: {
              ...prev.accountSettings,
              payments: { ...prev.accountSettings.payments, [key]: value },
            },
          }
        : null
    );
  };

  const updateDeals = (key: keyof AccountSettings["deals"], value: number) => {
    if (!data) return;
    setData((prev) =>
      prev
        ? {
            ...prev,
            accountSettings: {
              ...prev.accountSettings,
              deals: { ...prev.accountSettings.deals, [key]: value },
            },
          }
        : null
    );
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <LoadingScreen description="settings"/>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 px-4">
        <div className="text-center">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ letterSpacing: "1px" }}
          >
            Admin Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your store configuration{" "}
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-2 h-auto">
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">
            Contact
          </TabsTrigger>
          {/* <TabsTrigger value="shipping" className="text-xs sm:text-sm">
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs sm:text-sm">
            Payments
          </TabsTrigger>
          <TabsTrigger value="deals" className="text-xs sm:text-sm">
            Deals
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Store className="h-4 w-4 sm:h-5 sm:w-5" />
                Store Information
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Shared
                </span>
              </CardTitle>
              <CardDescription className="text-sm">
                Basic details about your beauty store (affects all admin users)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  value={data.accountSettings.settings.storeName}
                  onChange={(e) => updateSettings("storeName", e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">Business Address</Label>
                <Textarea
                  id="store-address"
                  value={data.accountSettings.settings.storeAddress}
                  onChange={(e) =>
                    updateSettings("storeAddress", e.target.value)
                  }
                  rows={3}
                  className="text-sm sm:text-base"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                <Input
                  id="tax-rate"
                  type="number"
                  step="0.01"
                  value={data.accountSettings.settings.taxRate}
                  onChange={(e) =>
                    updateSettings("taxRate", parseFloat(e.target.value) || 0)
                  }
                  className="text-sm sm:text-base"
                />
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Regional Settings
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Shared
                </span>
              </CardTitle>
              <CardDescription className="text-sm">
                Configure regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={data.accountSettings.settings.currency}
                    onValueChange={(value) => updateSettings("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={data.accountSettings.settings.timezone}
                    onValueChange={(value) => updateSettings("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        India Standard Time
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Security
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Personal
                </span>
              </CardTitle>
              <CardDescription className="text-sm">
                Change your admin account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="text-sm sm:text-base pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="text-sm sm:text-base pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="text-sm sm:text-base pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Shield className="mr-2 h-4 w-4" />
                {changingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Contact Information
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Personal
                </span>
              </CardTitle>
              <CardDescription className="text-sm">
                Your personal contact details (separate for each admin)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={data.accountSettings.contactInfo.email}
                  onChange={(e) => updateContactInfo("email", e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  value={data.accountSettings.contactInfo.phoneNumber}
                  onChange={(e) =>
                    updateContactInfo("phoneNumber", e.target.value)
                  }
                  className="text-sm sm:text-base"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      {/* Mobile-friendly save button at bottom */}
      <div className="sticky bottom-4 sm:hidden">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full shadow-lg"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
