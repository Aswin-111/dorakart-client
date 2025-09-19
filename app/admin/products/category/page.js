"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import axios from "@/lib/interceptor";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/v1/category/getcategories?page=${page}&limit=10`);
      setCategories(res.data.categories || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/v1/category/deletecategory/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category) => {
    setEditData(category);
    setShowEdit(true);
  };

  return (
    <main className="flex flex-col min-h-screen max-w-[1100px] px-6 py-8 mx-auto bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 py-2">
        <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
        <Button
          variant="secondary"
          className="rounded-xl"
          onClick={() => setShowCreate(true)}
        >
          Add Category
        </Button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 w-60 font-medium">Name</th>
                <th className="px-4 py-3 w-60 font-medium">Status</th>
                <th className="px-4 py-3 w-60 font-medium">Image</th>
                <th className="px-4 py-3 w-60 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium">{category.category_name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-muted text-foreground text-xs font-medium ring-1 ring-inset ring-border">
                      • Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-center bg-cover ring-1 ring-border shadow-sm"
                      style={{ backgroundImage: `url(${category.category_photo})` }}
                    />
                  </td>
                  <td className="px-2 py-1 text-sm">
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
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            setDeleteConfirm({ show: true, id: category.id })
                          }
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No categories found.
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
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="size-10 rounded-xl border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Next page"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateCategoryModal
          onClose={() => {
            setShowCreate(false);
            fetchCategories();
          }}
        />
      )}

      {showEdit && editData && (
        <EditCategoryModal
          data={editData}
          onClose={() => {
            setShowEdit(false);
            fetchCategories();
          }}
        />
      )}

      {/* Delete confirm */}
      <Dialog
        open={deleteConfirm.show}
        onOpenChange={() => setDeleteConfirm({ show: false, id: null })}
      >
        <DialogContent className="max-w-sm bg-popover text-popover-foreground border border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this category?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ show: false, id: null })}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteCategory(deleteConfirm.id);
                setDeleteConfirm({ show: false, id: null });
                fetchCategories();
              }}
              className="rounded-xl"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* ===========================
   CreateCategoryModal
   =========================== */

function CreateCategoryModal({ onClose }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async () => {
    if (!name || !photo) {
      toast.error("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("category_name", name);
    data.append("category_photo", photo);

    const toastId = toast.loading("Creating...");
    try {
      await axios.post("/api/v1/category/createcategory", data);
      toast.success("Category created", { id: toastId });
      onClose();
    } catch (err) {
      toast.error("Failed to create", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-popover text-popover-foreground border border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category Photo</Label>
            <Input
              type="file"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="bg-background border-border"
            />
            {preview && (
              <img
                src={preview}
                className="w-16 h-16 mt-2 rounded-xl object-cover ring-1 ring-border"
                alt="Preview"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-xl">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ===========================
   EditCategoryModal
   =========================== */

function EditCategoryModal({ data, onClose }) {
  const [name, setName] = useState(data.category_name);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(data.category_photo);

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    formData.append("category_name", name);
    if (photo) formData.append("category_photo", photo);

    const toastId = toast.loading("Updating...");
    try {
      await axios.put(`/api/v1/category/editcategory/${data.id}`, formData);
      toast.success("Category updated", { id: toastId });
      onClose();
    } catch (err) {
      toast.error("Failed to update", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-popover text-popover-foreground border border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category Photo</Label>
            <Input
              type="file"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="bg-background border-border"
            />
            {preview && (
              <img
                src={preview}
                className="w-16 h-16 mt-2 rounded-xl object-cover ring-1 ring-border"
                alt="Preview"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-xl">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
