import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <button className="size-10 flex items-center justify-center text-[#121416]">
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`size-10 flex items-center justify-center rounded-full text-sm ${
            page === currentPage
              ? "font-bold bg-[#f1f2f4]"
              : "font-normal"
          }`}
        >
          {page}
        </button>
      ))}
      <button className="size-10 flex items-center justify-center text-[#121416]">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
