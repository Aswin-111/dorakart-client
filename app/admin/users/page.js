"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/interceptor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import CreateUserModal from "../components/CreateUser";
import EditUserModal from "../components/EditUser";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("api/v1/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team members and their access.
          </p>
        </div>

        {/* Primary action with icon, still uses the same CreateUserModal */}
        <div className="flex items-center gap-2">
          <CreateUserModal
            onSuccess={fetchUsers}
            trigger={
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Add user
              </Button>
            }
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border border-border bg-card text-card-foreground shadow-sm">
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 border-b border-border sticky top-0 z-10">
              <tr className="text-muted-foreground">
                <th className="px-4 py-3 font-medium text-left">Name</th>
                <th className="px-4 py-3 font-medium text-left">Phone</th>
                <th className="px-4 py-3 font-medium text-left">Status</th>
                <th className="px-2 py-3 font-medium text-right pr-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <div className="mx-auto max-w-sm">
                      <div className="text-base font-medium">No users found</div>
                      <p className="text-muted-foreground text-sm mt-1">
                        Create your first user to get started.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`border-b border-border/60 hover:bg-muted/30 transition-colors ${
                      idx % 2 === 1 ? "bg-background" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                          {String(user.name || "?")
                            .slice(0, 1)
                            .toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ID: {user._id?.slice(0, 6)}…
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-foreground">{user.phone}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border",
                          user.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            user.is_active ? "bg-emerald-400" : "bg-rose-400",
                          ].join(" ")}
                        />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-2 py-3 pr-4">
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl hover:bg-muted"
                              aria-label="Options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setEditingUser(user);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="cursor-pointer focus:bg-destructive/10"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                  try {
                                    await axios.delete(`/user/${user._id}`);
                                    toast.success("User deleted");
                                    fetchUsers();
                                  } catch (err) {
                                    toast.error("Failed to delete user");
                                  }
                                }
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSuccess={fetchUsers}
          open={editOpen}
          setOpen={setEditOpen}
        />
      )}
    </div>
  );
}
