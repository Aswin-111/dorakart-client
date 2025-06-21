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

      console.log(res.data.categories)
      setCategories(res.data.categories || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };
  const handleDeleteCategory = async (id) => {

    try {
      console.log("Trying to delete ID:", id); // 🔍
      await axios.delete(`/api/v1/category/deletecategory/${id}`);
      toast.success("Category deleted");
      fetchCategories(); // refresh
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };


  const handleEdit = (category) => {
    setEditData(category);
    setShowEdit(true);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white font-sans max-w-[960px] px-4 py-6 mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 py-2">
        <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">
          Categories
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-full bg-[#f1f2f4] text-[#121416] h-8 px-4 text-sm font-medium"
        >
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden border rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-white text-left text-sm font-medium text-[#121416]">
              <th className="px-4 py-3 w-60">Name</th>
              <th className="px-4 py-3 w-60">Status</th>
              <th className="px-4 py-3 w-60">Image</th>
              <th className="px-4 py-3 w-60">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="border-t border-[#dde1e3]">
                <td className="px-4 py-2 text-sm text-[#121416]">
                  {category.category_name}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full bg-[#f1f2f4] px-4 py-1 text-sm font-medium text-[#121416]">
                    Active
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${category.category_photo})` }}
                  />
                </td>
                <td className="px-4 py-2 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded hover:bg-gray-100">⋮</button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => setDeleteConfirm({ show: true, id: category.id })}>
                        Delete
                      </DropdownMenuItem>

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
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="size-10 flex items-center justify-center text-[#121416]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`size-10 flex items-center justify-center rounded-full text-sm ${p === page ? "font-bold bg-[#f1f2f4]" : "font-normal"
                }`}
            >
              {p}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="size-10 flex items-center justify-center text-[#121416]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>




      {showCreate && <CreateCategoryModal onClose={() => {
        setShowCreate(false);
        fetchCategories();
      }} />}

      {showEdit && editData && <EditCategoryModal data={editData} onClose={() => {
        setShowEdit(false);
        fetchCategories();
      }} />}
      <Dialog open={deleteConfirm.show} onOpenChange={() => setDeleteConfirm({ show: false, id: null })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to delete this category?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm({ show: false, id: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteCategory(deleteConfirm.id);
                setDeleteConfirm({ show: false, id: null });
                 fetchCategories();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
}

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category Photo</Label>
            <Input
              type="file"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {preview && <img src={preview} className="w-16 h-16 mt-2 rounded-full object-cover" />}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Category Photo</Label>
            <Input
              type="file"
              onChange={(e) => {
                setPhoto(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {preview && <img src={preview} className="w-16 h-16 mt-2 rounded-full object-cover" />}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}