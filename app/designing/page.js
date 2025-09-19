"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/interceptor";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "react-hot-toast";
import Card from "@/components/card.jsx";

export default function DesigningPage() {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedDownloadId, setSelectedDownloadId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [designImages, setDesignImages] = useState([]);

  useEffect(() => {
    fetchDesigns();
  }, [filter, search, page]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/designs/getdesigns", {
        params: {
          filter,
          search,
          page,
        },
      });
      console.log(res.data)
      setDesigns(res.data.designs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching designs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const handleDownload = (id) => {
    setSelectedDownloadId(id);
    setShowDownloadModal(true);
  };
  const confirmDownload = async () => {
    try {


      const response = await axios.get(`/api/v1/designs/downloadorderdesigner/${selectedDownloadId}`, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data], { type: "application/zip" });
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/["']/g, "")
        : "download.zip";
      toast.success("Download started");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Download failed");
      console.error("Download failed", error);
    } finally {
      setShowDownloadModal(false);
      setSelectedDownloadId(null);
    }
  };
  const handleView = async (id) => {
    try {
      const res = await axios.get(`/api/v1/designs/viewdesignorder/${id}`);
      console.log(res)
      setViewData(res.data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error fetching order view:", error);
    }
  };
  const uploadDesignImages = async (orderId) => {

    const formData = new FormData();
    designImages.forEach((img) => formData.append("design_images", img));

    try {

      console.log(orderId, "qwerty")
      const res = await axios.post(`/api/v1/designs/submit-designs/${orderId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Designs uploaded!");
      setDesignImages([]);
      setShowViewModal(false);
      fetchDesigns(); // optional: refresh list
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-[Inter,_Noto_Sans,sans-serif]">
      <Toaster />
      <div className="layout-container flex grow flex-col h-full">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111518] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Designing
              </p>
            </div>

            {/* Tabs */}
            <div className="pb-3">
              <div className="flex border-b border-[#dbe1e6] px-4 gap-8">
                {["all", "pending", "finished"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${filter === tab
                      ? "border-b-[#111518] text-[#111518]"
                      : "border-b-transparent text-[#60768a]"
                      } text-sm font-bold tracking-[0.015em]`}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full items-stretch rounded-xl h-full bg-[#f0f2f5]">
                  <div className="text-[#60768a] flex items-center pl-4 rounded-l-xl">
                    🔍
                  </div>
                  <input
                    placeholder="Search customers"
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full flex-1 rounded-r-xl border-none bg-[#f0f2f5] h-full px-4 text-base placeholder:text-[#60768a] focus:outline-none"
                  />
                </div>
              </label>
            </div>

            {/* Table */}
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
                <div className="w-full overflow-y-auto max-h-[500px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium">Phone</th>
                        <th className="px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium">Lead Owner</th>
                        <th className="px-4 py-3 text-left text-[#111518] w-60 text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-[#60768a] w-60 text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center">Loading...</td>
                        </tr>
                      ) : designs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center text-[#60768a]">No results found.</td>
                        </tr>
                      ) : (
                        designs.map((row, index) => (
                          <tr key={index} className="border-t border-t-[#dbe1e6]">
                            <td className="px-4 py-2 w-[400px] text-[#111518] text-sm font-normal">{row.customer_name}</td>
                            <td className="px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal">{row.phone}</td>
                            <td className="px-4 py-2 w-[400px] text-[hsl(209,18%,46%)] text-sm font-normal">{row.lead_owner}</td>
                            <td className="px-4 py-2"> <Card status={row.status} /></td>

                            <td className="px-4 py-2 w-60">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 rounded hover:bg-gray-100 text-lg">⋮</button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40">
                                  <DropdownMenuItem onClick={() => handleView(row._id)}>View</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownload(row._id)}>Download</DropdownMenuItem>
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
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                <CaretLeftIcon />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`size-10 rounded-full text-sm ${p === page ? "bg-[#f0f2f5] font-bold" : ""
                    }`}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && <span className="text-sm">...</span>}
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                <CaretRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
          </DialogHeader>
          <p>Do you want to download all images for this order?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDownloadModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDownload}>
              Download ZIP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

              <div className="mt-6 w-full flex flex-col items-center">
                <b className="text-sm text-gray-800 mb-2">Please upload your designs:</b>

                {/* Upload Box */}
                <label className="w-full max-w-xl border-2 border-dashed border-purple-400 rounded-xl p-6 text-center cursor-pointer hover:bg-purple-50 transition">
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setDesignImages((prev) => [...prev, ...files]);
                    }}
                  />
                  <div className="flex flex-col items-center text-purple-700 space-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m0-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">Choose or drag files here</p>
                    <p className="text-xs text-gray-500">Allowed: JPG, PNG • Max: 30 images</p>
                  </div>
                </label>

                {/* Preview Images */}
                {designImages.length > 0 && (
                  <div className="w-full max-w-xl mt-4 overflow-x-auto flex gap-4 py-2">
                    {designImages.map((file, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="object-cover w-full h-full rounded-lg border"
                        />
                        <button
                          onClick={() =>
                            setDesignImages((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 rounded-bl"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  className="mt-4"
                  onClick={() => uploadDesignImages(viewData.order_id)}
                  disabled={designImages.length === 0}
                >
                  Submit Designs
                </Button>
              </div>


            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

const CaretLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
  </svg>
);

const CaretRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
  </svg>
);
