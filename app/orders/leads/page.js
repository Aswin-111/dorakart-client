"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "@/lib/interceptor";
import { toast, Toaster } from "react-hot-toast";
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
const RATINGS = ["hot", "warm", "cold", "junk"];
const STATUSES = ["new", "followup", "won"];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("new");

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showDelete, setShowDelete] = useState(false);

  const [showOrderConfirm, setShowOrderConfirm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [address, setAddress] = useState("");



  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`/api/v1/leads/getlead/${id}`);
      setEditData(res.data.lead);
      setShowEdit(true);
    } catch {
      toast.error("Failed to load lead details");
    }
  };


  const handleDelete = (orderId) => {
    setSelectedOrder(orderId);
    setShowDelete(true);
  };
  const handleOrder = (leadId) => {
    setSelectedOrder(leadId);
    setShowOrderConfirm(true);
  };
  const handlePlaceOrder = async () => {
    console.log('handlePlaceOrder', [selectedProductId]);
    const formData = new FormData();
    const productIds = [];
    productIds.push(selectedProductId);
    formData.append("order_id", orderData.orderId);
    formData.append("user_id", orderData.lead_details.lead_owner);
    formData.append("lead_id", orderData.lead_details._id);
    formData.append("address", address);
    formData.append("products", JSON.stringify(productIds));

    files.forEach((file) => {
      formData.append("order_images", file); // must match multer field name
    });

    const toastId = toast.loading("Placing order...");
    try {
      await axios.post("/api/v1/orders/createorder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Order placed successfully!", { id: toastId });
      setShowOrderModal(false);
      setSelectedProductId("");
      setFiles([]);
      setImagePreviews([]);
      setAddress("");
    } catch (err) {
      toast.error("Failed to place order", { id: toastId });
    }
  };


  useEffect(() => {
    fetchLeads();
  }, [page, filter]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `/api/v1/leads/getleads?page=${page}&limit=10&filter=${filter}`
      );
      setLeads(res.data.leads || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load leads");
    }
  };



  return (
    <main className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden">
      <Toaster />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111518] text-[32px] font-bold">All Leads</p>
              <button
                onClick={() => setShowCreate(true)}
                className="rounded-full bg-[#f1f2f4] text-[#111518] h-8 px-4 text-sm font-medium"
              >
                Create New Lead
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
              {["all", "new", "followup", "won",].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilter(type);
                    setPage(1);
                  }}
                  className={`flex flex-col items-center justify-center pb-[13px] pt-4 border-b-[3px] ${filter === type
                    ? "text-[#111518] border-b-[#111518] font-bold"
                    : "text-[#60768a] border-b-transparent"
                    }`}
                >
                  <p className="text-sm tracking-wide capitalize">{type}</p>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <Input
                placeholder="Search leads"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="px-4 py-3 overflow-hidden border border-[#dbe1e6] rounded-xl">
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 420px)" }}>
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="text-left text-sm font-medium text-[#111518]">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads
                      .filter((lead) =>
                        lead.fullname.toLowerCase().includes(search.toLowerCase())
                      )
                      .map((lead, idx) => (
                        <tr key={idx} className="border-t border-[#dbe1e6] h-[72px]">
                          <td className="px-4 text-[#111518] text-sm">{lead.fullname}</td>
                          <td className="px-4 text-[#60768a] text-sm">{lead.phone}</td>
                          <td className="px-4 text-sm">
                            <button className="rounded-full bg-[#f0f2f5] h-8 px-4 text-sm font-medium text-[#111518]">
                              {lead.status}
                            </button>
                          </td>
                          <td className="px-4 py-2 w-60">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded hover:bg-gray-100">⋮</button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { handleEdit(lead._id); console.log("lead"); }}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(lead._id)}>
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrder(lead._id)}>
                                  Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu> </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 py-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="size-10 flex items-center justify-center text-[#121416]"
              >
                <ChevronLeft />
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
                onClick={() => setPage(page + 1)}
                className="size-10 flex items-center justify-center text-[#121416]"
              >
                <ChevronRight />
              </button>
            </div>
            {showOrderConfirm && (
              <Dialog open onOpenChange={() => setShowOrderConfirm(false)}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Confirm Order</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm">Do you want to confirm the order?</p>
                  <DialogFooter>
                    <Button
                      onClick={async () => {
                        try {
                          const res = await axios.post(`/api/v1/orders/preorderdetails/${selectedOrder}`);
                          console.log(res.data)
                          setOrderData(res.data);
                          setShowOrderConfirm(false);
                          setShowOrderModal(true);
                        } catch {
                          toast.error("Failed to load order details");
                        }
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Modals */}
            {showCreate && (
              <LeadModal
                title="Create Lead"
                onClose={() => {
                  setShowCreate(false);
                  fetchLeads();
                }}
              />
            )}
            {showEdit && (
              <LeadModal
                title="Edit Lead"
                data={editData}
                onClose={() => {
                  setShowEdit(false);
                  setEditData(null);
                  fetchLeads();
                }}
              />
            )}
            {showOrderModal && orderData && (
              <Dialog open onOpenChange={() => {
                setShowOrderModal(false); imagePreviews.forEach((img) => URL.revokeObjectURL(img.url));
                setFiles([]);
                setImagePreviews([]);
              }}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto  ">
                  <DialogHeader>
                    <DialogTitle>Confirm Order</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <Label>Order ID</Label>
                    <Input value={orderData.orderId} readOnly />

                    <Label>Customer Name</Label>
                    <Input value={orderData.lead_details.fullname} readOnly />

                    <Label>Phone</Label>
                    <Input value={orderData.lead_details.phone} readOnly />

                    <Label>Address</Label>
                    <Input
                      value={orderData.lead_details?.address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter address"
                    />


                    <Label>Select Product</Label>
                    <select
                      className="w-full border rounded p-2"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">-- Select Product --</option>
                      {orderData.product_details.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.product_name}
                        </option>
                      ))}
                    </select>

                    <Label>Upload Images</Label>
                    <div className="relative w-full">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#f1f2f4] border border-dashed border-gray-300 rounded cursor-pointer w-full text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L18 10.828m-6.586-6.586A2 2 0 0115.172 7z"
                          />
                        </svg>
                        Choose Images
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files);
                            const newPreviews = selected.map((file) => ({
                              file,
                              url: URL.createObjectURL(file),
                            }));
                            setFiles((prev) => [...prev, ...selected]);
                            setImagePreviews((prev) => [...prev, ...newPreviews]);
                          }}
                        />
                      </label>
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="flex overflow-x-auto gap-3 mt-3 pb-2">
                        {imagePreviews.map((img, idx) => (
                          <div key={img.url} className="relative flex-shrink-0">
                            <img
                              src={img.url}
                              alt={`preview-${idx}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                            <button
                              onClick={() => {
                                setFiles((prev) => prev.filter((_, i) => i !== idx));
                                setImagePreviews((prev) => {
                                  URL.revokeObjectURL(prev[idx].url);
                                  return prev.filter((_, i) => i !== idx);
                                });
                              }}
                              className="absolute top-0 right-0 bg-black text-white rounded-full p-1 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}


                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={!selectedProductId || files.length === 0}
                      >
                        Place Order
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}


            {showDelete && selectedOrder && (
              <DeleteModal
                onConfirm={async () => {
                  const toastId = toast.loading("Deleting...");
                  try {
                    await axios.delete(`/api/v1/leads/deletelead/${selectedOrder}`);
                    toast.success("Lead deleted", { id: toastId });
                    setShowDelete(false);
                    fetchLeads();
                  } catch {
                    toast.error("Delete failed", { id: toastId });
                  }
                }}
                onCancel={() => setShowDelete(false)}
              />
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// Modal for both Create and Edit
function LeadModal({ title, onClose, data = null }) {
  const [name, setName] = useState(data?.fullname || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [rating, setRating] = useState(data?.rating || "hot");
  const [status, setStatus] = useState(data?.status || "new");
  const [note, setNote] = useState(data?.note || "");
  const [address, setAddress] = useState(data?.address || "");

  const handleSubmit = async () => {
    if (!name || !phone) {
      toast.error("Name and phone are required");
      return;
    }

    const payload = {
      fullname: name,
      phone,
      rating,
      status,
      note,
      address,
    };
    console.log(payload)
    const toastId = toast.loading(data ? "Updating..." : "Creating...");
    try {
      if (data) {
        await axios.put(`/api/v1/leads/editlead/${data._id}`, payload);
        toast.success("Lead updated", { id: toastId });
      } else {
        await axios.post("/api/v1/leads/createlead", payload);
        toast.success("Lead created", { id: toastId });
      }
      onClose();
    } catch (err) {
      const message = err.response.data.message
      console.log(err)
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Rating</option>
              {RATINGS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{data ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-gray-600">
          Are you sure you want to delete this lead? This action cannot be undone.
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

