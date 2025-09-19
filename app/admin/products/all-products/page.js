"use client";

import { useEffect, useState } from "react";
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "@/lib/interceptor";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  async function fetchProducts() {
    try {
      const res = await axios.get(`/api/v1/products/getproducts?page=${page}&limit=10`);
      setTotalPages(res.data.totalPages || 1);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
    }
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`/api/v1/products/deleteproduct/${id}`);
      fetchProducts();
      toast.success("Product deleted");
    }
  }

  async function handleEdit(id) {
    try {
      const res = await axios.get(`/api/v1/products/getproduct/${id}`);
      setEditData(res.data.product);
      setShowEdit(true);
    } catch (err) {
      console.error("Failed to load product", err);
      toast.error("Failed to load product");
    }
  }

  return (
    <main className="flex flex-col min-h-screen max-w-[1100px] px-6 py-8 mx-auto bg-background text-foreground">
      <Toaster />
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 py-2">
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <Button
          variant="secondary"
          onClick={() => {
            setShowCreate(true);
            fetchCategories();
          }}
          className="rounded-xl"
        >
          Create Product
        </Button>
      </div>

      {/* Table card */}
      <div className="relative rounded-2xl border border-border bg-card shadow-sm p-0 max-h-[80vh] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 w-60 font-medium">Name</th>
                <th className="px-4 py-3 w-[200px] font-medium">Price</th>
                <th className="px-4 py-3 w-[160px] font-medium">Status</th>
                <th className="px-4 py-3 w-[140px] font-medium">Image</th>
                <th className="px-4 py-3 w-[100px] font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product, i) => (
                <tr
                  key={i}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">{product.product_name}</span>
                    {product.sku ? (
                      <span className="ml-2 text-xs text-muted-foreground">• {product.sku}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    ₹{product.selling_price}{" "}
                    <span className="text-xs"> (MRP ₹{product.mrp})</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-muted text-foreground text-xs font-medium ring-1 ring-inset ring-border">
                      • Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-center bg-cover ring-1 ring-border shadow-sm"
                      style={{ backgroundImage: `url(${product.product_link})` }}
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
                        className="w-32 bg-popover text-popover-foreground"
                        align="end"
                        side="bottom"
                        sideOffset={6}
                      >
                        <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No products found.
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
          className="size-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-5 text-foreground" />
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
                  : "bg-card border border-border hover:bg-muted text-foreground",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          className="size-10 rounded-xl border border-border bg-card hover:bg-muted flex items-center justify-center"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next page"
        >
          <ChevronRight className="size-5 text-foreground" />
        </button>
      </div>

      {/* Create Product Popup */}
      {showCreate && (
        <CreateProductPopup
          categories={categories}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            fetchProducts();
            setShowCreate(false);
          }}
        />
      )}

      {/* Edit Product Popup */}
      {showEdit && editData && (
        <EditProductPopup
          data={editData}
          categories={categories}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            fetchProducts();
            setShowEdit(false);
          }}
        />
      )}
    </main>
  );

  async function fetchCategories() {
    const res = await axios.get("/api/v1/products/loadcategories");
    setCategories(res.data.categories || []);
  }
}

/* ===========================
   CreateProductPopup
   =========================== */

function CreateProductPopup({ onClose, onCreated }) {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    product_name: "",
    sku: "",
    product_category: "",
    mrp: "",
    selling_price: "",
    product_photo: null,
    shape: "",
    size: "",
    thickness: "",
  });

  useEffect(() => {
    axios.get("/api/v1/products/loadcategories").then((res) => {
      setCategories(res.data.categories || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "product_photo") {
      setForm({ ...form, product_photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const {
      product_name,
      sku,
      product_category,
      mrp,
      selling_price,
      product_photo,
      shape,
      size,
      thickness,
    } = form;

    if (
      !product_name ||
      !sku ||
      !product_category ||
      !mrp ||
      !selling_price ||
      !product_photo ||
      !shape ||
      !size ||
      !thickness
    ) {
      toast.error("All fields are required");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    const toastId = toast.loading("Creating...");
    try {
      await axios.post("/api/v1/products/createproduct", data);
      toast.success("Product created", { id: toastId });
      onCreated();
    } catch (err) {
      toast.error("Failed to create", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-popover text-popover-foreground border border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <InputGroup label="Product Name" name="product_name" onChange={handleChange} />
          <InputGroup label="SKU" name="sku" onChange={handleChange} />
          <SelectGroup
            label="Category"
            name="product_category"
            options={categories.map((c) => ({ value: c._id, label: c.category_name }))}
            onChange={handleChange}
          />
          <InputGroup label="MRP" name="mrp" onChange={handleChange} />
          <InputGroup label="Selling Price" name="selling_price" onChange={handleChange} />
          <SelectGroup label="Shape" name="shape" options={["Square", "Circle", "Butterfly", "Eye"]} onChange={handleChange} />
          <SelectGroup label="Size" name="size" options={["6x8", "121x8", "16x12", "11x11"]} onChange={handleChange} />
          <SelectGroup label="Thickness" name="thickness" options={["3mm", "5mm", "7mm"]} onChange={handleChange} />
          <div className="col-span-2 space-y-2">
            <Label>Photo</Label>
            <Input type="file" name="product_photo" onChange={handleChange} />
            {preview && (
              <img
                src={preview}
                className="w-20 h-20 object-cover rounded-xl ring-1 ring-border"
                alt="Preview"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-xl">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ===========================
   Shared Inputs
   =========================== */

function InputGroup({ label, name, onChange, value }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        className="bg-background border-border"
      />
    </div>
  );
}

function SelectGroup({ label, name, onChange, options, value }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <select
        name={name}
        onChange={onChange}
        value={value}
        className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Select {label}</option>
        {options.map((opt) =>
          typeof opt === "string" ? (
            <option key={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

/* ===========================
   EditProductPopup
   =========================== */

function EditProductPopup({ data, categories, onClose, onUpdated }) {
  const [form, setForm] = useState({
    ...data,
    product_category: data.product_category?._id || data.product_category || "",
  });

  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      axios.get("/api/v1/products/loadcategories").then((res) => {
        setLocalCategories(res.data.categories || []);
      });
    } else {
      setLocalCategories(categories);
    }
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      product_name,
      sku,
      product_category,
      mrp,
      selling_price,
      shape,
      size,
      thickness,
    } = form;

    if (
      !product_name ||
      !sku ||
      !product_category ||
      !mrp ||
      !selling_price ||
      !shape ||
      !size ||
      !thickness
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    const toastId = toast.loading("Updating product...");
    try {
      await axios.put(`/api/v1/products/editproduct/${data._id}`, form);
      toast.success("Product updated", { id: toastId });
      onUpdated();
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-popover text-popover-foreground border border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <InputGroup label="Product Name" name="product_name" value={form.product_name} onChange={handleChange} />
          <InputGroup label="SKU" name="sku" value={form.sku} onChange={handleChange} />
          <SelectGroup
            label="Category"
            name="product_category"
            value={form.product_category}
            onChange={handleChange}
            options={localCategories.map((c) => ({
              value: c._id,
              label: c.category_name,
            }))}
          />
          <InputGroup label="MRP" name="mrp" value={form.mrp} onChange={handleChange} />
          <InputGroup label="Selling Price" name="selling_price" value={form.selling_price} onChange={handleChange} />
          <SelectGroup
            label="Shape"
            name="shape"
            value={form.shape}
            onChange={handleChange}
            options={["Square", "Circle", "Butterfly", "Eye"]}
          />
          <SelectGroup
            label="Size"
            name="size"
            value={form.size}
            onChange={handleChange}
            options={["6x8", "121x8", "16x12", "11x11"]}
          />
          <SelectGroup
            label="Thickness"
            name="thickness"
            value={form.thickness}
            onChange={handleChange}
            options={["3mm", "5mm", "7mm"]}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="rounded-xl">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
