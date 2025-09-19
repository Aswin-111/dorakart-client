"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/interceptor.js";
import toast, { Toaster } from "react-hot-toast";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Card from "@/components/card.jsx";

const ShippingPage = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewOrderData, setViewOrderData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);

    const limit = 10;

    useEffect(() => {
        fetchShippings();
    }, [page, filter]);

    const fetchShippings = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/v1/shipping/getshippings", {
                params: { page, limit, filter },
            });
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load shippings");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (val) => {
        setFilter(val);
        setPage(1);
    };

    const handleView = async (orderId) => {
        try {
            const res = await axios.get(`/api/v1/shipping/vieworderdetails/${orderId}`);


            console.log(res.data)
            setViewOrderData(res.data);
            setStatusOptions(res.data.status_options || []);
            setViewModal(true);
        } catch (err) {
            toast.error("Failed to load order details");
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await axios.put(`/api/v1/shipping/update-status/${viewOrderData.order_id}`, {
                status: newStatus,
            });
            toast.success("Status updated");
            setViewOrderData((prev) => ({ ...prev, status: newStatus }));
            fetchShippings(); // refresh table
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-[Inter,_Noto_Sans,sans-serif]">
            <Toaster />
            <div className="layout-container flex grow flex-col h-full">
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <p className="text-[#111518] text-[32px] font-bold leading-tight min-w-72">Shipping</p>
                        </div>

                        {/* Tabs */}
                        <div className="pb-3">
                            <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
                                {[
                                    "all",
                                    "assigned_to_shipping",
                                    "packing_started",
                                    "ready_for_shipping",
                                    "out_for_delivery",
                                    "order_delivered",
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`flex flex-col items-center justify-center pb-[13px] pt-4 border-b-[3px] ${filter === tab ? "border-b-[#111518] text-[#111518]" : "border-b-transparent text-[#60768a]"
                                            }`}
                                    >
                                        <p className="text-sm font-bold tracking-[0.015em] capitalize">{tab.replace(/_/g, " ")}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="px-4 py-3">
                            <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
                                <div className="w-full overflow-y-auto max-h-[500px]">
                                    <table className="w-full">
                                        <thead className="sticky top-0 bg-white z-10">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Name</th>
                                                <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Phone</th>
                                                <th className="px-4 py-3 text-left text-[#111518] text-sm font-medium">Status</th>
                                                <th className="px-4 py-3 text-left text-[#60768a] text-sm font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-sm text-[#60768a]">
                                                        Loading...
                                                    </td>
                                                </tr>
                                            ) : orders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-6 text-sm text-[#60768a]">
                                                        No shipping orders found
                                                    </td>
                                                </tr>
                                            ) : (
                                                orders.map((row, index) => (
                                                    <tr key={index} className="border-t border-t-[#dbe1e6]">
                                                        <td className="px-4 py-2 text-[#111518] text-sm font-normal">
                                                            {row.lead_id?.fullname || "-"}
                                                        </td>
                                                        <td className="px-4 py-2 text-[#60768a] text-sm font-normal">
                                                            {row.lead_id?.phone || "-"}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <Card status={row.status} />
                                                        </td>
                                                        <td className="px-4 py-2 w-60 text-sm font-bold tracking-[0.015em]">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="p-2 rounded hover:bg-gray-100 text-lg">⋮</button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleView(row._id)}>View</DropdownMenuItem>

                                                                    <DropdownMenuItem onClick={() => toast("Mark as delivered clicked")}>
                                                                        Mark Delivered
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
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
                                    className={`text-sm ${page === idx + 1 ? "font-bold bg-[#f0f2f5]" : "font-normal"
                                        } flex size-10 items-center justify-center text-[#111518] rounded-full`}
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
            {viewModal && viewOrderData && (
                <Dialog open onOpenChange={() => setViewModal(false)}>
                    <DialogContent className="max-w-lg max-h-[70vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Shipping Order Details</DialogTitle>
                        </DialogHeader>

                        <div className="text-sm space-y-2">
                            <div><b>Order ID:</b> {viewOrderData.order_id}</div>
                            <div><b>Customer Name:</b> {viewOrderData.customer_name}</div>
                            <div><b>Phone:</b> {viewOrderData.phone}</div>
                            <div><b>Lead Owner:</b> {viewOrderData.lead_owner}</div>
                            <div><b>Status:</b>
                                <select
                                    value={viewOrderData.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    className="ml-2 border px-2 py-1 text-sm rounded"
                                >
                                    <option value="assigned_to_shipping">Assigned to Shipping</option>
                                    <option value="packing_started">Packing Started</option>
                                    <option value="ready_for_shipping">Ready for Shipping</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="order_delivered">Order Delivered</option>
                                </select>

                            </div>

                            <div><b>Products:</b></div>
                            <ul className="list-disc pl-5 space-y-1">
                                {viewOrderData.products.map((p, i) => (
                                    <li key={i}><b>{p.name}</b> – Shape: {p.shape}, Size: {p.size}</li>
                                ))}
                            </ul>

                            {viewOrderData.designed_image_links?.length > 0 && (
                                <div>
                                    <b>Design Previews:</b>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {viewOrderData.designed_image_links.map((url, i) => (
                                            <img key={i} src={url} alt="design preview" className="h-24 object-contain border rounded" />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <b>Courier Slip:</b>
                                {viewOrderData.courier_slip ? (
                                    <div className="mt-2">
                                        <img
                                            src={`http://localhost:8000/courier/${viewOrderData.courier_slip}`}
                                            alt="Courier Slip"
                                            className="h-32 border rounded object-contain"
                                        />
                                    </div>
                                ) : (
                                    <form
                                        className="mt-2 flex gap-2 items-center"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const file = e.target.elements.file.files[0];
                                            const formData = new FormData();
                                            formData.append("file", file);

                                            try {
                                                const res = await axios.post(`/api/v1/shipping/upload-courier/${viewOrderData.order_id}`, formData);
                                                toast.success("Uploaded successfully");
                                                console.log(res.data);
                                                setViewOrderData((prev) => ({ ...prev, courier_slip: res.data.url.split("/courier/")[1] }));
                                            } catch {
                                                toast.error("Upload failed");
                                            }
                                        }}
                                    >
                                        <input type="file" name="file" accept="image/*" required className="text-sm" />
                                        <Button type="submit" size="sm">Upload</Button>
                                    </form>
                                )}
                            </div>

                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
};

export default ShippingPage;

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
