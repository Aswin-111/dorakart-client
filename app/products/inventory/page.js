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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      console.log(res.data, 'test')
      setInventory(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load inventory");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/v1/inventory/loadcategories");

      console.log(res.data, 'data')
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
    <main className="flex flex-col min-h-screen bg-white font-sans max-w-[960px] px-4 py-6 mx-auto">
      <Toaster />
      <div className="flex justify-between items-center py-2">
        <h1 className="text-[32px] font-bold text-[#121416]">Inventory</h1>
        <Button onClick={() => { setShowCreate(true); fetchCategories() }}>Create Inventory</Button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white text-left text-sm font-medium text-[#111518]">
              <th className="px-4 py-3 w-[240px]">Material</th>
              <th className="px-4 py-3 w-[200px]">Unit</th>
              <th className="px-4 py-3 w-[200px]">Quantity</th>
              <th className="px-4 py-3 w-[200px]">Category</th>
              <th className="px-4 py-3 w-[100px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{item.material_name}</td>
                <td className="px-4 py-2">{item.unit}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.product_category.category_name}</td>
                <td className="px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">⋮</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setEditData(item);
                        setShowEdit(true);
                      }}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item._id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 p-4">
        <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
          <ChevronLeft />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`size-10 rounded-full ${i + 1 === page ? "bg-[#f1f2f4] font-bold" : ""}`}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
          <ChevronRight />
        </button>
      </div>

      {showCreate && (
        <InventoryModal
          categories={categories}
          onClose={() => {
            setShowCreate(false);
            fetchInventory();
          }}
        />
      )}

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
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Inventory?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button onClick={handleDelete}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function InventoryModal({ isEdit = false, data = {}, categories, onClose }) {
  const [material_name, setMaterialName] = useState(data.material_name || "");
  const [product_category, setProductCategory] = useState(data.product_category || "");
  const [unit, setUnit] = useState(data.unit);
  const [quantity, setQuantity] = useState(data.quantity || "");

  const handleSubmit = async () => {
    if (!material_name || !product_category || !unit || !quantity) {
      toast.error("All fields are required");
      return;
    }

    const body = {
      material_name,
      product_category,
      unit,
      quantity,
    };

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Create"} Inventory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Material Name</Label>
            <Input value={material_name} onChange={(e) => setMaterialName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full px-3 py-2 border rounded-md"
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
            <Label>Unit</Label>
            <select
              className="w-full px-3 py-2 border rounded-md"
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
            <Label>Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
