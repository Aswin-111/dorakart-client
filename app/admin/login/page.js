"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/interceptor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

// Drop at: app/(auth)/login/page.tsx
// Visuals: keeps the modern Dorakart design; Functionality: phone/password login via your axios interceptor

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault(); // stops the form from refreshing

        if (!phone || !password) {
            toast.error("Phone and password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post("/api/v1/admin/login", { phone, password });

            if (res?.data?.token) {
                localStorage.setItem("dorakart_admin_token", res.data.token);
                toast.success("Login successful");
                router.push("/admin/dashboard");
            } else {
                toast.error("Unexpected response");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="relative min-h-svh w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            {/* Subtle grid + glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                <div className="absolute -top-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
            </div>

            <div className="mx-auto flex min-h-svh max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Brand */}
                    <div className="mb-8 flex items-center justify-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]">
                            <span className="text-xl font-black">D</span>
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold tracking-tight">Dorakart</h1>
                            <p className="text-xs text-slate-300">Admin Login</p>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label htmlFor="phone" className="text-sm text-slate-300">
                                    Phone
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    inputMode="tel"
                                    placeholder="Enter phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400 focus-visible:ring-fuchsia-500/30"
                                    autoComplete="tel"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm text-slate-300">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-fuchsia-300 hover:text-fuchsia-200">
                                        Forgot?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10 rounded-xl border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400 focus-visible:ring-fuchsia-500/30"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute inset-y-0 right-2 inline-flex items-center justify-center rounded-md p-1.5 text-slate-300 hover:bg-white/5"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember / Create */}
                            <div className="flex items-center justify-between gap-2">
                                <label className="inline-flex select-none items-center gap-2 text-xs text-slate-300">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 cursor-pointer rounded border-white/10 bg-slate-900/60 text-fuchsia-500 focus:ring-fuchsia-500"
                                        defaultChecked
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-xs text-slate-400 hover:text-slate-200">
                                    Create account
                                </a>
                            </div>

                            {/* Error toasts handled via react-hot-toast; keep an inline fallback if needed */}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/25 transition hover:bg-fuchsia-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    <>
                                        Login
                                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
