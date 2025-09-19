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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAs } from "file-saver";
import Card from "@/components/card.jsx";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selectedAssignOrderId, setSelectedAssignOrderId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [isOnePayment, setIsOnePayment] = useState(null);
  const [bill1, setBill1] = useState(null);
  const [bill2, setBill2] = useState(null); // only for second bill

  useEffect(() => {
    fetchOrders();
  }, [page, filter]);
  const handleBillUpload = async () => {
    if (!bill1 || (isOnePayment === false && !bill2)) {
      return toast.error("Please upload all required bill(s)");
    }

    const toastId = toast.loading("Uploading bill(s)...");

    try {
      const formData = new FormData();
      formData.append("order_id", viewData.order_id);
      formData.append("is_one_payment", isOnePayment);
      formData.append("bill1", bill1);
      if (bill2) formData.append("bill2", bill2);

      await axios.post("/api/v1/orders/upload-bill", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Bills uploaded successfully", { id: toastId });
      setBill1(null);
      setBill2(null);
    } catch (err) {
      toast.error("Bill upload failed", { id: toastId });
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.post(`/api/v1/orders/getorders?page=${page}&limit=10&filter=${filter}`);
      console.log(res.data)
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  const handleView = async (orderId) => {
    try {
      const res = await axios.get(`/api/v1/orders/vieworderdetails/${orderId}`);
      console.log(res.data, 'werty');
      setViewData(res.data);
      setShowViewModal(true);
    } catch (err) {
      toast.error("Failed to load order details");
    }
  };


  const handleDownload = async (orderId) => {
    const toastId = toast.loading("Preparing download...");
    try {
      const res = await axios.get(`/api/v1/orders/download-designs/${orderId}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `designs-${orderId}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Downloaded successfully", { id: toastId });
    } catch (err) {
      toast.error("Download failed", { id: toastId });
    }
  };

  const handleApprove = async (orderId) => {
    const toastId = toast.loading("Approving...");
    try {
      await axios.put(`/api/v1/orders/approveorder/${orderId}`);
      toast.success("Order approved", { id: toastId });
      fetchOrders(); // refresh list
    } catch (err) {
      toast.error("Approval failed", { id: toastId });
    }
  };

  const handleReject = async (orderId) => {
    const toastId = toast.loading("Rejecting...");
    try {
      console.log(orderId, "qwerty")
      await axios.put(`/api/v1/orders/reject-design/${orderId}`);
      toast.success("Design rejected", { id: toastId });
      fetchOrders(); // refresh list
    } catch (err) {
      toast.error("Reject failed", { id: toastId });
    }
  };
  const downloadDesignZip = async (orderId) => {
    const toastId = toast.loading("Preparing download...");
    console.log(orderId);
    try {
      const response = await axios.get(
        `/api/v1/orders/download-view-designs/${orderId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });

      const contentDisposition = response.headers["content-disposition"];
      let filename = `designs-${orderId}.zip`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) filename = match[1];
      }

      saveAs(blob, filename);
      toast.success("Download ready!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Download failed", { id: toastId });
    }
  };



  return (
    <main className="relative flex min-h-screen flex-col bg-white font-sans overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <Toaster />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">

            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111518] text-[32px] font-bold min-w-72">All Orders</p>
              <button onClick={() => setShowCreateOrderModal(true)} className="rounded-full h-8 px-4 bg-[#f0f2f5] text-sm font-medium">
                Create New Order
              </button>
            </div>

            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
                {["all", "design_completed", "design_rejected"].map((tab) => (
                  <button key={tab} onClick={() => { setFilter(tab); setPage(1); }}
                    className={`border-b-[3px] pb-[13px] pt-4 ${filter === tab ? "border-[#111518] text-[#111518]" : "border-transparent text-[#60768a]"}`}>
                    <p className="text-sm font-bold capitalize">{tab.replace("_", " ")}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <div className="flex items-center h-12 rounded-xl bg-[#f0f2f5]">
                <div className="px-4 text-[#60768a]">
                  🔍
                </div>
                <input placeholder="Search orders"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full px-2 outline-none text-base" />
              </div>
            </div>

            {/* Table */}
            <div className="px-4 py-3 border rounded-xl border-[#dbe1e6]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left text-sm font-medium text-[#111518]">
                      {/* <th className="px-4 py-3">Order ID</th> */}
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      // .filter(order => order.customer_name?.toLowerCase().includes(search.toLowerCase()))
                      .map((order, i) => (
                        <tr key={i} className="border-t border-[#dbe1e6] h-[72px]">
                          {/* <td className="px-4 py-2">{order.order_id}</td> */}
                          <td className="px-5">{order.lead_id?.fullname || "N/A"}</td>
                          <td>{order.lead_id?.phone || "N/A"}</td>

                          <td className="px-4 py-2"> <Card status={order.status} /></td>
                          <td className="px-4 py-2 ">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded hover:bg-gray-100 text-lg">⋮</button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 rounded-md bg-white p-1 shadow-md border">
                                <DropdownMenuItem onClick={() => handleView(order._id)}>
                                  View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDownload(order)}
                                  disabled={order.status !== "design_completed"}
                                  className={order.status !== "design_completed" ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-muted text-sm px-3 py-2 rounded"}

                                >
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(order.order_id)}

                                  disabled={order.status !== "design_completed"}
                                  className={order.status !== "design_completed" ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-muted text-sm px-3 py-2 rounded"}

                                >
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReject(order.order_id)}
                                  disabled={order.status !== "design_completed"}
                                  className={order.status !== "design_completed" ? "text-gray-400 cursor-not-allowed" : "cursor-pointer hover:bg-muted text-sm px-3 py-2 rounded"}

                                >
                                  Reject
                                </DropdownMenuItem>




                                <DropdownMenuItem onClick={() => {
                                  setSelectedAssignOrderId(order._id);
                                  setShowAssign(true);
                                }}>
                                  Assign
                                </DropdownMenuItem>

                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>


                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="py-6 flex justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="text-[#121416]">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setPage(p)} className={`size-10 rounded-full text-sm ${page === p ? "bg-[#f1f2f4] font-bold" : ""}`}>
                    {p}
                  </button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="text-[#121416]">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCreateOrderModal && (
        <CreateOrderFromAllModal onClose={() => setShowCreateOrderModal(false)} />
      )}
      {showAssign && selectedAssignOrderId && (
        <AssignOrderModal
          orderId={selectedAssignOrderId}
          onClose={() => {
            setShowAssign(false);
            setSelectedAssignOrderId(null);
          }}
        />
      )}
      {showViewModal && viewData && (
        <Dialog open onOpenChange={() => setShowViewModal(false)}>
          <DialogContent className="max-w-lg max-h-[50vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2 text-sm text-gray-700 ">
              <div><b>Order ID:</b> {viewData.order_id}</div>
              <div><b>Customer:</b> {viewData.customer_name}</div>
              <div><b>Phone:</b> {viewData.phone}</div>
              <div><b>Lead Owner:</b> {viewData.lead_owner}</div>

              <div className="pt-2"><b>Products:</b></div>
              <ul className="list-disc pl-5 space-y-1">
                {viewData.products.map((p, i) => (
                  <li key={i}>
                    <b>{p.name}</b> – Shape: {p.shape}, Size: {p.size}
                  </li>
                ))}
              </ul>

              {/* 👉 ADD THIS FOR IMAGE PREVIEWS */}
              {viewData.image_links?.length > 0 && (
                <>
                  <div className="pt-4 font-semibold">Order Images</div>
                  <div className="flex gap-2 flex-wrap">
                    {viewData.image_links.map((url, idx) => (
                      <> <img
                        key={idx}
                        src={`${url}`}
                        alt={`Order ${idx}`}
                        className="w-20 h-20 rounded border object-cover"
                      />

                      </>
                    ))}
                  </div>
                </>
              )}

              {viewData.designed_image_links?.length > 0 && (
                <>
                  <div className="pt-4 font-semibold">Designed Images</div>
                  <div className="flex gap-2 flex-wrap">
                    {viewData.designed_image_links.map((url, idx) => (
                      <>
                        <img
                          key={idx}
                          src={url}
                          alt={`Design ${idx}`}
                          className="w-20 h-20 rounded border object-cover"
                        />
                      </>
                    ))}
                  </div>
                </>
              )}

              <Button className="mt-4" onClick={() => downloadDesignZip(viewData.order_id)}>
                Download Designs ZIP
              </Button>
              <Label>Select Payment Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="one"
                    checked={isOnePayment === true}
                    onChange={() => { setIsOnePayment(true); setBill2(null); }}
                  />
                  One-Time Payment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="two"
                    checked={isOnePayment === false}
                    onChange={() => setIsOnePayment(false)}
                  />
                  Two-Time Payment
                </label>
              </div>

              {isOnePayment !== null && (
                <div className="pt-4 flex flex-col gap-4">
                  {/* BILL 1 */}
                  <div>
                    <Label>Bill 1</Label>
                    {bill1 ? (
                      <div className="relative w-fit">
                        <img
                          src={URL.createObjectURL(bill1)}
                          alt="Bill 1"
                          className="w-20 h-20 object-cover border rounded"
                        />
                        <button
                          onClick={() => setBill1(null)}
                          className="absolute top-[-8px] right-[-8px] bg-white text-red-600 border border-red-600 rounded-full px-1 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ) : viewData?.bill1_url ? (
                      <div className="relative w-fit">
                        <img
                          src={viewData.bill1_url}
                          alt="Bill 1"
                          className="w-20 h-20 object-cover border rounded"
                        />
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBill1(e.target.files[0])}
                      />
                    )}
                  </div>

                  {/* BILL 2 */}
                  {!isOnePayment && (
                    <div>
                      <Label>Bill 2</Label>
                      {bill2 ? (
                        <div className="relative w-fit">
                          <img
                            src={URL.createObjectURL(bill2)}
                            alt="Bill 2"
                            className="w-20 h-20 object-cover border rounded"
                          />
                          <button
                            onClick={() => setBill2(null)}
                            className="absolute top-[-8px] right-[-8px] bg-white text-red-600 border border-red-600 rounded-full px-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : viewData?.bill2_url ? (
                        <div className="relative w-fit">
                          <img
                            src={viewData.bill2_url}
                            alt="Bill 2"
                            className="w-20 h-20 object-cover border rounded"
                          />
                        </div>
                      ) : (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setBill2(e.target.files[0])}
                        />
                      )}
                    </div>
                  )}

                  <Button onClick={handleBillUpload}>
                    Upload Bill{isOnePayment === false ? "s" : ""}
                  </Button>
                </div>
              )}




            </div>
          </DialogContent>
        </Dialog>
      )}


    </main>
  );
}
function CreateOrderFromAllModal({ onClose }) {
  const [orderData, setOrderData] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [address, setAddress] = useState("");
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/orders/getleadsfororder").then((res) => {
      setOrderData(res.data);
    }).catch(() => toast.error("Failed to fetch data"));
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedLeadId || !selectedProductId || !address || files.length === 0) {
      return toast.error("Please fill all fields and upload images");
    }

    const formData = new FormData();
    formData.append("order_id", orderData.orderId);
    formData.append("user_id", orderData.leads.find((l) => l._id === selectedLeadId).lead_owner);
    formData.append("lead_id", selectedLeadId);
    formData.append("address", address);
    formData.append("products[]", selectedProductId);
    files.forEach(file => formData.append("order_images", file));

    const toastId = toast.loading("Placing order...");
    try {
      await axios.post("/api/v1/orders/createorderfromallorder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Order placed successfully!", { id: toastId });
      onClose();
    } catch {
      toast.error("Order creation failed", { id: toastId });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create New Order</DialogTitle></DialogHeader>

        {!orderData ? <p>Loading...</p> : (
          <div className="grid gap-4 py-4">
            <Label>Order ID</Label>
            <Input value={orderData.orderId} readOnly />

            <Label>Lead</Label>
            <select className="border rounded px-3 py-2"
              value={selectedLeadId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedLeadId(id);
                const lead = orderData.leads.find(l => l._id === id);
                setAddress(lead?.address || "");
              }}>
              <option value="">Select Lead</option>
              {orderData.leads.map(lead => (
                <option key={lead._id} value={lead._id}>{lead.fullname} - {lead.phone}</option>
              ))}
            </select>

            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />

            <Label>Product</Label>
            <select className="border rounded px-3 py-2"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}>
              <option value="">Select Product</option>
              {orderData.product_details.map(product => (
                <option key={product._id} value={product._id}>{product.product_name}</option>
              ))}
            </select>

            <Label>Upload Images</Label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-[#f0f2f5] p-2 rounded text-sm font-medium">
                📷 Choose Images
                <input type="file" className="hidden" accept="image/*" multiple
                  onChange={(e) => {
                    const selected = Array.from(e.target.files);
                    setFiles(selected);
                    setImagePreviews(selected.map((f) => URL.createObjectURL(f)));
                  }}
                />
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex overflow-x-auto gap-2 py-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} className="w-20 h-20 object-cover rounded" />
                    <button onClick={() => {
                      const updated = [...files];
                      updated.splice(idx, 1);
                      setFiles(updated);
                      setImagePreviews(updated.map((f) => URL.createObjectURL(f)));
                    }} className="absolute top-0 right-0 text-red-500 bg-white rounded-full text-xs">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button onClick={handlePlaceOrder}>Place Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// AssignOrderModal.jsx



function AssignOrderModal({ orderId, onClose }) {
  const [activeTab, setActiveTab] = useState("designer");
  const [designers, setDesigners] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/v1/orders/getusers");
      setDesigners(res.data.designers || []);
      setPrinters(res.data.printers || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const handleAssign = async () => {
    const toastId = toast.loading("Assigning order...");

    try {
      console.log(selectedUser, "selecteduserid")
      await axios.get("/api/v1/orders/assignorder", {
        params: {
          user_id: selectedUser,
          order_id: orderId,
          role: activeTab,
        },
      });
      toast.success("Order assigned successfully", { id: toastId });
      setShowConfirm(false);
      onClose();
    } catch (err) {
      console.log(err.response.data.message)
      if (err?.response.data.message) toast.error(err.response.data.message, { id: toastId });
      // toast.error("Assignment failed", { id: toastId });
      setShowConfirm(false);
      onClose();
    }
  };

  const users = activeTab === "designer" ? designers : printers;

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>Assign Order</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="designer">Designer</TabsTrigger>
              <TabsTrigger value="printer">Printer</TabsTrigger>
            </TabsList>

            <TabsContent value="designer">
              {designers.map((user) => (
                <div key={user._id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={selectedUser === user._id}
                    onCheckedChange={() => setSelectedUser(user._id)}
                  />
                  <Label>{user.name}</Label>
                </div>
              ))}

            </TabsContent>

            <TabsContent value="printer">
              {printers.map((user) => (
                <div key={user._id} className="flex items-center gap-2 py-1">
                  <Checkbox
                    checked={selectedUser === user._id}
                    onCheckedChange={() => setSelectedUser(user._id)}
                  />
                  <Label>{user.name}</Label>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!selectedUser) return toast.error("Please select a user");
                setShowConfirm(true);
              }}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showConfirm && (
        <Dialog open onOpenChange={() => setShowConfirm(false)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Assignment</DialogTitle>
            </DialogHeader>
            <p className="text-sm">Are you sure you want to assign this order?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}