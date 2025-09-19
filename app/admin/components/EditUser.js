"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "@/lib/interceptor";

const PAGES = ["dashboard", "products", "users", "designing", "printing", "shipping"];

export default function EditUserModal({ user, onSuccess, open, setOpen }) {
  const [form, setForm] = useState({ ...user, password: "", confirmPassword: "", pages: user.accessible_pages || [] });

  const togglePage = (page) => {
    setForm((prev) => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter((p) => p !== page)
        : [...prev.pages, page],
    }));
  };

  const handleUpdate = async () => {
    try {
      const updates = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        role: form.role,
      };

      if (form.password && form.password === form.confirmPassword) {
        updates.password = form.password;
      }

      await axios.put(`/edit-user/${user._id}`, updates);
      await axios.put("/pages", { userId: user._id, pages: form.pages });

      await axios.put("/toggle-user-status", {
        userId: user._id,
        status: form.is_active ? "activate" : "deactivate",
      });

      toast.success("User updated");
      setOpen(false);
      onSuccess();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="New Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Input placeholder="Confirm Password" type="password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={() => setForm({ ...form, is_active: !form.is_active })}
            />
            <label>Active</label>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Accessible Pages</p>
            <div className="grid grid-cols-2 gap-2">
              {PAGES.map((page) => (
                <label key={page} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.pages.includes(page)}
                    onChange={() => togglePage(page)}
                  />
                  {page}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
