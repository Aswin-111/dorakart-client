import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const products = [
  {
    name: "Product 1",
    price: 100,
    stock: "100",
    category: "Electronics",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9o0esltVxUytqtcLTkkyIe0xSIYxofGrPCbqwjYJ28qZO9BM3m4V-2xW2UMudvqokw8GKyX5OWD-Ximj0F0M8V4phe-zfpLXmKVVVeRjtczU-DHYZBvk-CMfEze-2z-qluCng0lX79FicBixPBV1_okWjiD53Mqk5Q203bfDfZqGrVyDqvh9m0hI3rqWqS8luLxiBm0XBtKJjGioVKAtPX-KH4asGCEd1BknZ2dPIHx3bMaI4ZhyZ64AuHVkfZYfWOv52nZVFgPuT",
  },
  {
    name: "Product 2",
    price: 50,
    stock: "50",
    category: "Clothing",
    status: "Active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAto30OlYhqUhnWyTp_irYvfzf1SQw5XxaeWIaH6E-EUhApqr8LFLMq4uVQ31eyq1UlaxY4e8JmIrRdaECWtjnYrxMARsVwb7drOQMRCigZPccoMSbHodoSKwDDWJLpjQR7q0na2DcT2e3hYDp8EwOTflWuP_Fm1tFoT1hBmtvGF3bdJu1pfAFtoNDMwfDmjhJRDYqk0vu1XYG7W_l5PvRzwm-Az_prknU7keWcivfnTmepOLD70RxnvOXe5A3cvV6dY7nj_Gp2JTEN",
  },
];

export default function ProductTable() {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-white text-left text-sm font-medium text-[#121416]">
          <th className="px-4 py-3 w-60">Name</th>
          <th className="px-4 py-3 w-[400px]">Price</th>
          <th className="px-4 py-3 w-60">Status</th>
          <th className="px-4 py-3 w-60">Image</th>
          <th className="px-4 py-3 w-60">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, i) => (
          <tr key={i} className="border-t border-[#dde1e3]">
            <td className="px-4 py-2 text-sm text-[#121416]">{product.name}</td>
            <td className="px-4 py-2 text-sm text-[#6a7681]">{product.price}</td>
            <td className="px-4 py-2 text-sm">
              <span className="rounded-full px-4 py-1 bg-[#f1f2f4] text-[#121416] text-sm font-medium">
                {product.status}
              </span>
            </td>
            <td className="px-4 py-2">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />
            </td>
            <td className="px-4 py-2 text-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => alert("Edit clicked")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Delete clicked")}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
