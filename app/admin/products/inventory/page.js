"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/interceptor";
import { toast, Toaster } from "react-hot-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [page]);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(`/api/v1/inventory/getinventory?page=${page}&limit=10`);
      setInventory(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load inventory");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/inventory/loadcategories");
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/inventory/deleteinventory/${deleteId}`);
      toast.success("Inventory deleted");
      fetchInventory();
      setDeleteId(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <main className="flex flex-col min-h-screen max-w-[1100px] px-6 py-8 mx-auto bg-background text-foreground">
      <Toaster />
      {/* Header */}
      <div className="flex justify-between items-center py-2">
        <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
        <Button
          className="rounded-xl"
          onClick={() => { setShowCreate(true); fetchCategories(); }}
        >
          Create Inventory
        </Button>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 w-[240px] font-medium">Material</th>
                <th className="px-4 py-3 w-[200px] font-medium">Unit</th>
                <th className="px-4 py-3 w-[200px] font-medium">Quantity</th>
                <th className="px-4 py-3 w-[200px] font-medium">Category</th>
                <th className="px-4 py-3 w-[100px] font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventory.map((item, i) => (
                <tr key={i} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm">{item.material_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {/* If you expose category name on item, show it here */}
                    {item.product_category?.category_name || ""}
                  </td>
                  <td className="px-2 py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 rounded-xl hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label="Open actions"
                        >
                          <MoreVertical className="size-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        sideOffset={6}
                        className="w-36 bg-popover text-popover-foreground"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setEditData(item);
                            setShowEdit(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(item._id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No inventory found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="size-10 rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-5" />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          const isActive = p === page;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={[
                "size-9 rounded-full text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border hover:bg-muted",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          className="size-10 rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Next page"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Create */}
      {showCreate && (
        <InventoryModal
          categories={categories}
          onClose={() => {
            setShowCreate(false);
            fetchInventory();
          }}
        />
      )}

      {/* Edit */}
      {showEdit && editData && (
        <InventoryModal
          isEdit
          data={editData}
          categories={categories}
          onClose={() => {
            setShowEdit(false);
            fetchInventory();
          }}
        />
      )}

      {/* Confirm Delete */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm bg-popover text-popover-foreground border border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Delete Inventory?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="rounded-xl">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function InventoryModal({ isEdit = false, data = {}, categories, onClose }) {
  const [material_name, setMaterialName] = useState(data.material_name || "");
  const [product_category, setProductCategory] = useState(
    data.product_category?._id || data.product_category || ""
  );
  const [unit, setUnit] = useState(data.unit || "");
  const [quantity, setQuantity] = useState(data.quantity || "");

  const handleSubmit = async () => {
    if (!material_name || !product_category || !unit || !quantity) {
      toast.error("All fields are required");
      return;
    }

    const body = { material_name, product_category, unit, quantity };

    const toastId = toast.loading(isEdit ? "Updating..." : "Creating...");
    try {
      if (isEdit) {
        await axios.put(`/api/v1/inventory/editinventory/${data._id}`, body);
        toast.success("Inventory updated", { id: toastId });
      } else {
        await axios.post("/api/v1/inventory/createinventory", body);
        toast.success("Inventory created", { id: toastId });
      }
      onClose();
    } catch (err) {
      toast.error("Operation failed", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-popover text-popover-foreground border border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit" : "Create"} Inventory
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Material Name</Label>
            <Input
              value={material_name}
              onChange={(e) => setMaterialName(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category</Label>
            <select
              className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={product_category}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">Select</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Unit</Label>
            <select
              className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">Select Unit</option>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="pack">pack</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-xl">
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
