"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Users,
  Eye,
  EyeOff,
  ChevronDown,
  UserPlus,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import {
  Permission,
  PERMISSION_GROUPS,
  DEFAULT_ROLES,
} from "@/lib/permissions";
import { LoadingScreen } from "@/components/global/loading";
import { getRolePermissions } from "@/lib/utils/admin-roles";
import AlertDialogBox from "@/components/global/alert-dialog";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: Permission[];
  lastLoginAt?: string;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("custom");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: "",
    loading: false,
  });
  const [suspendDialog, setSuspendDialog] = useState({
    open: false,
    userId: "",
    loading: false,
    action: "",
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleIds: [] as string[],
    defaultRole: "" as keyof typeof DEFAULT_ROLES | "",
  });

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as Permission[],
  });

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    roleIds: [] as string[],
    defaultRole: "" as keyof typeof DEFAULT_ROLES | "",
  });

  useEffect(() => {
    fetchAdminUsers();
    fetchAdminRoles();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (data.success) {
        setAdminUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast.error("Error", {
        description: "Failed to fetch admin users",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminRoles = async () => {
    try {
      const response = await fetch("/api/admin/roles");
      const data = await response.json();
      if (data.success) {
        setAdminRoles(data.roles);
      }
    } catch (error) {
      console.error("Error fetching admin roles:", error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    // Validate role selection
    if (selectedTab === "default" && !newUser.defaultRole) {
      toast.error("Error", {
        description: "Please select a default role",
      });
      return;
    }

    if (selectedTab === "custom" && newUser.roleIds.length === 0) {
      toast.error("Error", {
        description: "Please assign at least one custom role",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        ...(selectedTab === "default"
          ? { defaultRole: newUser.defaultRole }
          : { roleIds: newUser.roleIds }),
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setIsAddUserDialogOpen(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          roleIds: [],
          defaultRole: "",
        });
        setSelectedTab("custom");
        fetchAdminUsers();
        toast.success("Success", {
          description: "Admin user created successfully",
        });
      } else {
        toast.error("Error", {
          description: data.error || "Failed to create admin user",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create admin user",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async () => {
    if (!editUser.name || !editUser.email) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setSaving(true);
    try {
      setAdminUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser?.id
            ? { ...user, name: editUser.name, email: editUser.email }
            : user
        )
      );

      const response = await fetch(`/api/admin/users/${editingUser?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
        }),
      });

      setIsEditUserDialogOpen(false);
      setEditingUser(null);

      toast.success("Success", {
        description: "User updated successfully",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update user",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.name || newRole.permissions.length === 0) {
      toast.error("Error", {
        description: "Please provide role name and select permissions",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRole),
      });

      const data = await response.json();

      if (data.success) {
        setIsAddRoleDialogOpen(false);
        setNewRole({ name: "", description: "", permissions: [] });
        fetchAdminRoles();
        toast.success("Success", {
          description: "Admin role created successfully",
        });
      } else {
        toast.error("Error", {
          description: data.error || "Failed to create admin role",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create admin role",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAdminUsers();
        toast.success("Success", {
          description: `User ${
            newStatus === "active" ? "activated" : "suspended"
          } successfully`,
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update user status",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdminUsers();
        toast.success("Success", {
          description: "Admin user deleted successfully",
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete admin user",
      });
    }
  };
  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const handlePermissionGroupToggle = (
    groupPermissions: Permission[],
    checked: boolean
  ) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...groupPermissions])]
        : prev.permissions.filter((p) => !groupPermissions.includes(p)),
    }));
  };

  const handleOpenEditDialog = (user: AdminUser) => {
    setEditingUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      roleIds: [],
      defaultRole: "",
    });
    setIsEditUserDialogOpen(true);
  };

  const filteredUsers = adminUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen description="admin users" />;
  }

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Admin Users
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Add Role Dialog */}
          <Dialog
            open={isAddRoleDialogOpen}
            onOpenChange={setIsAddRoleDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="ml-2 sm:ml-0">Add Role</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-2 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Admin Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={newRole.name}
                      onChange={(e) =>
                        setNewRole({ ...newRole, name: e.target.value })
                      }
                      placeholder="e.g., Store Manager"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Input
                      id="role-description"
                      value={newRole.description}
                      onChange={(e) =>
                        setNewRole({ ...newRole, description: e.target.value })
                      }
                      placeholder="Brief description of the role"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(PERMISSION_GROUPS).map(
                      ([groupName, groupPermissions]) => (
                        <Card key={groupName}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`group-${groupName}`}
                                checked={groupPermissions.every((p) =>
                                  newRole.permissions.includes(p)
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionGroupToggle(
                                    groupPermissions,
                                    checked === true
                                  )
                                }
                              />
                              <Label
                                htmlFor={`group-${groupName}`}
                                className="font-medium text-sm"
                              >
                                {groupName}
                              </Label>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {groupPermissions.map((permission) => (
                                <div
                                  key={permission}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={permission}
                                    checked={newRole.permissions.includes(
                                      permission
                                    )}
                                    onCheckedChange={(checked) =>
                                      handlePermissionToggle(
                                        permission,
                                        checked === true
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={permission}
                                    className="text-xs sm:text-sm"
                                  >
                                    {permission
                                      .replace(/[_:]/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddRoleDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddRole}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Creating...
                      </>
                    ) : (
                      "Create Role"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Admin User Dialog */}
          <Dialog
            open={isAddUserDialogOpen}
            onOpenChange={setIsAddUserDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto" variant="default">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="ml-2 sm:ml-0">Add Admin</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-2 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Admin User</DialogTitle>
                <DialogDescription>
                  Add a new admin user with predefined or custom role
                  permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input
                      id="user-name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role Assignment</Label>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="default"
                        className="flex items-center gap-2 text-xs"
                      >
                        <UserPlus className="h-3 w-3" />
                        Default
                      </TabsTrigger>
                      <TabsTrigger
                        value="custom"
                        className="flex items-center gap-2 text-xs"
                      >
                        <Shield className="h-3 w-3" />
                        Custom
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="default" className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="default-role">
                          Select a Default Role
                        </Label>
                        <Select
                          value={newUser.defaultRole}
                          onValueChange={(value) =>
                            setNewUser({
                              ...newUser,
                              defaultRole: value as keyof typeof DEFAULT_ROLES,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a predefined role" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DEFAULT_ROLES).map(
                              ([key, role]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex flex-col items-start">
                                    <span className="font-medium text-sm">
                                      {role.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {role.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        {newUser.defaultRole && (
                          <div className="p-3 bg-muted rounded-md">
                            <h4 className="text-sm font-medium mb-2">
                              {DEFAULT_ROLES[newUser.defaultRole].name}{" "}
                              Permissions:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {DEFAULT_ROLES[newUser.defaultRole].permissions
                                .slice(0, 6)
                                .map((permission) => (
                                  <Badge
                                    key={permission}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {permission
                                      .replace(/[_:]/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Badge>
                                ))}
                              {DEFAULT_ROLES[newUser.defaultRole].permissions
                                .length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +
                                  {DEFAULT_ROLES[newUser.defaultRole]
                                    .permissions.length - 6}{" "}
                                  more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-3">
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <Label>Assign Custom Roles</Label>
                        {adminRoles.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No custom roles available. Create a custom role
                            first.
                          </p>
                        ) : (
                          adminRoles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-start space-x-2 p-2 border rounded"
                            >
                              <Checkbox
                                id={role.id}
                                checked={newUser.roleIds.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setNewUser({
                                      ...newUser,
                                      roleIds: [...newUser.roleIds, role.id],
                                    });
                                  } else {
                                    setNewUser({
                                      ...newUser,
                                      roleIds: newUser.roleIds.filter(
                                        (id) => id !== role.id
                                      ),
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={role.id} className="flex-1">
                                <div className="font-medium text-sm">
                                  {role.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {role.description}
                                </div>
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddUserDialogOpen(false);
                      setNewUser({
                        name: "",
                        email: "",
                        password: "",
                        roleIds: [],
                        defaultRole: "",
                      });
                      setSelectedTab("custom");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    disabled={saving}
                    className="w-full sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="mx-2 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-user-name">Full Name</Label>
              <Input
                id="edit-user-name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-user-email">Email</Label>
              <Input
                id="edit-user-email"
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditUserDialogOpen(false);
                  setEditingUser(null);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditUser}
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  "Update User"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin Roles Summary Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {adminRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">
                {role.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {role.userCount}
              </div>
              <p className="text-xs text-muted-foreground">users assigned</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Admin Users Management
            </CardTitle>
            <CardDescription className="text-sm">
              Manage admin users, their roles, and permissions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search admin users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedUser(
                          expandedUser !== user.id ? user.id : null
                        )
                      }
                      className="ml-2 h-8 w-8 p-0"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedUser === user.id ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge
                      variant={
                        user.role === "super_admin" ? "default" : "secondary"
                      }
                    >
                      {user.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>

                  {expandedUser === user.id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Last Login:</span>{" "}
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "Never"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            setSuspendDialog({
                              open: true,
                              userId: user.id,
                              loading: false,
                              action:
                                user.status === "active"
                                  ? "suspended"
                                  : "active",
                            })
                          }
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                        <AlertDialogBox
                          open={
                            deleteDialog.open && deleteDialog.userId === user.id
                          }
                          handleOpen={() =>
                            setDeleteDialog({
                              open: !deleteDialog.open,
                              userId: deleteDialog.open ? "" : user.id,
                              loading: false,
                            })
                          }
                          description={`This action cannot be undone. This will permanently delete the admin user "${user.name}" and remove all associated data.`}
                          loading={deleteDialog.loading}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogBox>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Admin Users Management
          </CardTitle>
          <CardDescription>
            Manage admin users, their roles, and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "super_admin" ? "default" : "secondary"
                      }
                    >
                      {user.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("en-IN")
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit user
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setSuspendDialog({
                              open: true,
                              userId: user.id,
                              loading: false,
                              action:
                                user.status === "active"
                                  ? "suspended"
                                  : "active",
                            })
                          }
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View permissions</DropdownMenuItem>
                        <DropdownMenuItem>View activity log</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              userId: user.id,
                              loading: false,
                            })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Dialogs */}
      {deleteDialog.open && (
        <AlertDialogBox
          open={deleteDialog.open}
          handleOpen={() =>
            setDeleteDialog({ open: false, userId: "", loading: false })
          }
          description={`This action cannot be undone. This will permanently delete the admin user and remove all associated data.`}
          loading={deleteDialog.loading}
          onClick={() => handleDeleteUser(deleteDialog.userId)}
        >
          <div></div>
        </AlertDialogBox>
      )}

      {suspendDialog.open && (
        <AlertDialogBox
          open={suspendDialog.open}
          handleOpen={() =>
            setSuspendDialog({
              open: false,
              userId: "",
              loading: false,
              action: "",
            })
          }
          description={`Are you sure you want to ${
            suspendDialog.action === "active" ? "activate" : "suspend"
          } this user? This will ${
            suspendDialog.action === "active"
              ? "restore their access"
              : "revoke their access"
          } to the admin panel.`}
          loading={suspendDialog.loading}
          onClick={() =>
            handleToggleUserStatus(suspendDialog.userId, suspendDialog.action)
          }
        >
          <div></div>
        </AlertDialogBox>
      )}
    </div>
  );
}
