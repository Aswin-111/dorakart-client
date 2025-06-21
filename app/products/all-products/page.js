"use client";

import { useEffect, useState } from "react";
import { MoreVertical, ChevronLeft, ChevronRight, X } from "lucide-react";
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



      console.log(res.data)
      setTotalPages(res.data.totalPages || 1);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this product?")) {
      await axios.delete(`/api/v1/products/deleteproduct/${id}`);
      fetchProducts();
    }
  }

  async function handleEdit(id) {
    try {
      const res = await axios.get(`/api/v1/products/getproduct/${id}`);

      console.log(res.data)
      setEditData(res.data.product);
      setShowEdit(true);
    } catch (err) {
      console.error("Failed to load product", err);
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-white font-sans max-w-[960px] px-4 py-6 mx-auto">
      {/* Header */}




      <Toaster />
      <div className="flex flex-wrap justify-between items-center gap-3 py-2">
        <p className="text-[#121416] text-[32px] font-bold leading-tight min-w-72">
          Products
        </p>
        <button
          onClick={() => {
            setShowCreate(true);
            fetchCategories();
          }}
          className="rounded-full bg-[#f1f2f4] text-[#121416] h-8 px-4 text-sm font-medium"
        >
          Create Product
        </button>
      </div>

      {/* Subheading */}


      {/* Table */}
      <div className="relative rounded-xl border border-[#f1f2f4] p-4 max-h-[90vh] overflow-y-auto">

        <table className="w-full">
          <thead>
            <tr className="bg-white text-left text-sm font-medium text-[#121416]">
              <th className="px-4 py-3 w-60">Name</th>
              <th className="px-4 py-3 w-[200px]">Price</th>
              <th className="px-4 py-3 w-[160px]">Status</th>
              <th className="px-4 py-3 w-[140px]">Image</th>
              <th className="px-4 py-3 w-[100px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={i} className="border-t border-[#dde1e3]">
                <td className="px-4 py-2 text-sm text-[#121416]">{product.product_name}</td>
                <td className="px-4 py-2 text-sm text-[#6a7681]">
                  ₹{product.selling_price} (MRP ₹{product.mrp})
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className="rounded-full px-4 py-1 bg-[#f1f2f4] text-[#121416] text-sm font-medium">
                    Active
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div
                    className="w-10 h-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.product_link})` }}
                  />
                </td>
                <td className="px-4 py-2 text-sm">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-28" align="end" side="bottom" sideOffset={5}>
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)}>
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
          className="size-10 flex items-center justify-center text-[#121416]"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
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
          className="size-10 flex items-center justify-center text-[#121416]"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          <ChevronRight className="w-5 h-5" />
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

// CreateProductPopup Component


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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
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
            {preview && <img src={preview} className="w-20 h-20 object-cover rounded" />}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InputGroup({ label, name, onChange, value }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} />
    </div>
  );
}

function SelectGroup({ label, name, onChange, options, value }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select name={name} onChange={onChange} value={value} className="w-full border rounded h-10 px-2">
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


// EditProductPopup Component
function EditProductPopup({ data, categories, onClose, onUpdated }) {
  const [form, setForm] = useState({ ...data });

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <InputGroup label="Product Name" name="product_name" value={form.product_name} onChange={handleChange} />
          <InputGroup label="SKU" name="sku" value={form.sku} onChange={handleChange} />
          <SelectGroup
            label="Category"
            name="product_category"
            value={form.product_category}
            onChange={handleChange}
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
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
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}