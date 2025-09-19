"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  ClipboardList,
  Users,
  ChevronLeft,
  LogOut,
} from "lucide-react";

export default function   AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");
  const go = (href) => router.push(href);

  return (
    <aside
      className={[
        "h-screen border-r bg-card text-card-foreground shadow-sm",
        collapsed ? "w-[4.25rem]" : "w-72",
        "transition-[width] duration-200 ease-out",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex items-center justify-between px-3 py-3">
          <button
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted/50"
            onClick={() => go("/admin/dashboard")}
            aria-label="NovaCRM Home"
          >
            <div className="size-7 shrink-0 rounded-xl bg-primary/15 grid place-items-center">
              <Package className="size-4 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">DoraKart</span>
                <span className="text-[10px] text-muted-foreground leading-none">Admin</span>
              </div>
            )}
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-muted"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={["size-4 transition-transform", collapsed ? "rotate-180" : ""].join(" ")} />
          </Button>
        </div>

        <Separator />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {/* Dashboard */}
          <NavItem
            collapsed={collapsed}
            icon={<LayoutDashboard className="size-4" />}
            label="Dashboard"
            active={isActive("/admin/dashboard")}
            onClick={() => go("/admin/dashboard")}
          />

          {/* Products */}
          <div className={["rounded-xl", isActive("/admin/products") ? "bg-muted/40" : ""].join(" ")}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="products" className="border-none">
                <AccordionTrigger className="w-full rounded-xl px-2 py-2 hover:no-underline data-[state=open]:bg-muted/60">
                  <div className="flex w-full items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-lg bg-muted">
                      <Package className="size-4" />
                    </span>
                    {!collapsed && <span className="text-sm font-medium">Products</span>}
                  </div>
                </AccordionTrigger>
                {!collapsed && (
                  <AccordionContent className="px-3 pb-2 pt-1">
                    <SubItem
                      label="All products"
                      icon={<ClipboardList className="size-3.5" />}
                      active={isActive("/admin/products/all-products")}
                      onClick={() => go("/admin/products/all-products")}
                    />
                    <SubItem
                      label="Category"
                      icon={<Tags className="size-3.5" />}
                      active={isActive("/admin/products/category")}
                      onClick={() => go("/admin/products/category")}
                    />
                    <SubItem
                      label="Inventory"
                      icon={<Boxes className="size-3.5" />}
                      active={isActive("/admin/products/inventory")}
                      onClick={() => go("/admin/products/inventory")}
                    />
                  </AccordionContent>
                )}
              </AccordionItem>
            </Accordion>
          </div>

          {/* Users */}
          <NavItem
            collapsed={collapsed}
            icon={<Users className="size-4" />}
            label="Users"
            active={isActive("/admin/users")}
            onClick={() => go("/admin/users")}
          />
        </nav>

        <Separator />

        {/* Logout */}
        <div className="px-2 py-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-destructive/15">
                  <LogOut className="size-4" />
                </span>
                {!collapsed && <span>Logout</span>}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Are you sure you want to logout?</p>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => document.activeElement?.blur()}>Cancel</Button>
                <Button
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    try {
                      localStorage.removeItem("dorakart_admin_token");
                    } catch {}
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Helpers (JSX) ---------- */

function NavItem({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors",
        active ? "bg-primary/10 text-primary ring-1 ring-primary/30" : "hover:bg-muted/60",
      ].join(" ")}
    >
      <span className={["grid size-8 place-items-center rounded-lg", active ? "bg-primary/15 text-primary" : "bg-muted"].join(" ")}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

function SubItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60",
      ].join(" ")}
    >
      <span className="grid size-6 place-items-center rounded-md bg-muted">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

