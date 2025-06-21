"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/interceptor.js"
import toast, { Toaster } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
export default function PrintingPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);


  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const limit = 10;
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: "", // 'approve' | 'ship'
    order: null,
  });


  useEffect(() => {
    fetchOrders();
  }, [page, filter]);
  const openConfirmModal = (type, order) => {
    setConfirmModal({ show: true, type, order });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ show: false, type: "", order: null });
  };
  const handleApprove = async (order) => {
    try {
      await axios.put(`/api/v1/printers/approveorder/${order.order_id}`);
      toast.success("Order approved successfully");
      fetchOrders(); // Refresh
    } catch (err) {
      toast.error("Failed to approve order");
    } finally {
      closeConfirmModal();
    }
  };

  const confirmShip = async (order) => {
    try {
      await axios.put(`/api/v1/printers/shiporder/${order.order_id}`);
      toast.success("Order marked as shipped");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to mark as shipped");
    } finally {
      closeConfirmModal();
    }
  };

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/printers/orders", {
        params: { page, limit, filter },
      });
      setOrders(res.data.orders);
      console.log(res.data)
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err.response.data.message)
      err.response.data.message ? toast.error(err.response.data.message) : toast.error("Failed to load orders");

    } finally {
      setLoading(false);
    }
  }

  const handleTabChange = (val) => {
    setFilter(val);
    setPage(1);
  };
  const handleView = async (row) => {
    try {
      console.log(row)
      const res = await axios.get(`/api/v1/printers/orderdetail/${row.order_id}`);
      console.log(res)
      setViewData({
        order_id: res.data.order_id,
        customer_name: res.data.lead_name,
        phone: res.data.lead_phone,
        lead_owner: res.data.lead_owner_name,
        products: res.data.products.map((p) => ({
          name: p.product_name,
          shape: p.shape,
          size: p.size,
        })),
      });
      setShowViewModal(true);
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch order details");
    }
  };


  const handleDownload = async (orderId) => {
    try {
      const res = await axios.get(`/api/v1/printers/downloadorderprinter/${orderId}`, {
        responseType: "blob", // Important: get file as binary
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `designs-${orderId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download ZIP");
    }
  };


  const handleShip = async (order) => {
    try {
      await axios.put(`/api/v1/printers/shiporder/${order.order_id}`);
      toast.success("Order marked as shipped");
      fetchOrders(); // Refresh data
    } catch (err) {
      toast.error("Failed to mark as shipped");
    }
  };


  const downloadDesignZip = async (orderId) => {
    try {
      const res = await axios.get(`/api/v1/printers/downloadorderprinter/${orderId}`, {
        responseType: "blob", // Important: get file as binary
      });

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `designs-${orderId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download ZIP");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-[Inter,_Noto_Sans,sans-serif]">





      <Toaster />
      <div className="layout-container flex grow flex-col h-full">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">Printing</p>
            </div>

            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
                {["all", "pending", "finished"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`flex flex-col items-center justify-center pb-[13px] pt-4 border-b-[3px] ${filter === tab ? "border-b-[#111518] text-[#111518]" : "border-b-transparent text-[#60768a]"
                      }`}
                  >
                    <p className="text-sm font-bold tracking-[0.015em] capitalize">{tab}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
                <div className="w-full overflow-y-auto max-h-[500px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white  z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Phone</th>
                        <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Lead Owner</th>
                        <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-[#60768a] text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-sm text-[#60768a]">Loading...</td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-sm text-[#60768a]">No orders found</td>
                        </tr>
                      ) : (
                        orders.map((row, index) => (
                          <tr key={index} className="border-t border-t-[#dbe1e6]">
                            <td className="px-4 py-2 text-[#111518] text-sm font-normal">{row.lead_name}</td>
                            <td className="px-4 py-2 text-[#60768a] text-sm font-normal">{row.lead_phone}</td>
                            <td className="px-4 py-2 text-[#60768a] text-sm font-normal">{row.lead_owner_name}</td>
                            <td className="px-4 py-2 text-sm font-normal">
                              <button className="flex min-w-[84px] h-8 px-4 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111518] text-sm font-medium">
                                <span className="truncate">{row.status}</span>
                              </button>
                            </td>
                            <td className="px-4 py-2 text-[#60768a] text-sm font-bold tracking-[0.015em] cursor-pointer"><td className="px-4 py-2 w-60 text-sm font-bold tracking-[0.015em]">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 rounded hover:bg-gray-100 text-lg">⋮</button>

                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="">
                                  <DropdownMenuItem onClick={() => handleView(row)}>View</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openConfirmModal("approve", row)}>Approve</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openConfirmModal("ship", row)}>Ship</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center p-4 gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex size-10 items-center justify-center disabled:opacity-30"
              >
                <CaretLeftIcon />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`text-sm font-${page === idx + 1 ? "bold" : "normal"
                    } flex size-10 items-center justify-center text-[#111518] rounded-full ${page === idx + 1 ? "bg-[#f0f2f5]" : ""
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="flex size-10 items-center justify-center disabled:opacity-30"
              >
                <CaretRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      {confirmModal.show && (
        <Dialog open onOpenChange={closeConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {confirmModal.type === "approve" ? "Approve Order" : "Ship Order"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-3 text-sm">
              Are you sure you want to{" "}
              <b>{confirmModal.type === "approve" ? "approve" : "ship"}</b> this order?
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={closeConfirmModal}>Cancel</Button>
              <Button
                onClick={() =>
                  confirmModal.type === "approve"
                    ? handleApprove(confirmModal.order)
                    : confirmShip(confirmModal.order)
                }
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showViewModal && viewData && (
        <Dialog open onOpenChange={() => setShowViewModal(false)}>
          <DialogContent className="max-w-lg max-h-[50vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 py-2 text-sm text-gray-700">
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

              <Button className="mt-4" onClick={() => downloadDesignZip(viewData.order_id)}>
                Download Designs ZIP
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

const CaretLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
  </svg>
);

const CaretRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
  </svg>
);
