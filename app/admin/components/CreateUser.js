// ✅ CreateUserModal.js
"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "@/lib/interceptor";

const PAGES = ["dashboard", "products", "users", "designing", "printing", "shipping"];
const ROLES = ["user", "designer", "printer", "shipper"];

export default function CreateUserModal({ onSuccess }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        pages: [],
        is_active: true,
    });

    const togglePage = (page) => {
        setForm((prev) => ({
            ...prev,
            pages: prev.pages.includes(page)
                ? prev.pages.filter((p) => p !== page)
                : [...prev.pages, page],
        }));
    };

    const handleCreate = async () => {
        const { name, phone, email, password, confirmPassword, role, pages, is_active } = form;

        if (password !== confirmPassword) return toast.error("Passwords do not match");

        try {
            const res = await axios.post("/create-user", {
                name,
                phone,
                email,
                password,
                role,
                is_active,
            });

            const userId = res.data.user.id;
            if (pages.length > 0) {
                await axios.put("/pages", { userId, pages });
            }

            toast.success("User created");
            setOpen(false);
            onSuccess();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Error creating user");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <Input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    <Input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Input placeholder="Confirm Password" type="password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />

                    <select
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                        <option value="" disabled>Select Role</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                    </select>

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
                    <Button onClick={handleCreate}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
