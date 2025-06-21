const categories = [
  {
    name: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFc4yw93GGfg7TBYN_xYSrB8SHdA6RehrYNHLrFW5uofF2wHLGLNCmJlgexTVxNruwGYM34LslJmV8hApTaLFNQI6fP9S6UQAPBubKCbRhPWF8lgbbOEU3DE-R4Tu7z_3aZXYn1Nl_d_nOBKhATYXcRLvATs9xtDQ31EYHkZXvi_kBLJqXKvTO-bo5xqOs5cxNtkmGnz9nBk_kewoDumdbJc414wStRCuy2_eDMUgiJ-k8m0d6xRww4fKskDzZuQXpAWGaHnMcyNa6",
    count: 120,
    status: "Active",
  },
  {
    name: "Clothing",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPQL8h5DwGIdQ9Qpn1ahNvAfCY_SMaMdR2Mzqxbew3hMe68ByMUBKZojept5twveTYFf0qoTfBG6p8319las4JlcxPZuRJBViiRop8wRbJcbo1srxHs4dqosWHGj6FDjsEUwRx-WV_Ed6eLuamsgdcvm6dXA1XjuyWjae8BjC78ISoaGIi9jHRUO4ohxjz_Z6l4vdXfQSsiJvcz8RCOPjmhIrA1UzDGBXW6fG5GdLZs1VaFzoVY8HxLZ2qTm5vMbGSxikAVgSM6Xwf",
    count: 85,
    status: "Active",
  },
  // Add more categories...
];

export default function CategoryTable() {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-white text-left text-sm font-medium text-[#121416]">
          <th className="px-4 py-3 w-60">Name</th>
          <th className="px-4 py-3 w-60">Status</th>
          <th className="px-4 py-3 w-60">Image</th>

          <th className="px-4 py-3 w-60 text-[#6a7681]">Action</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, index) => (
          <tr key={index} className="border-t border-[#dde1e3]">
            <td className="px-4 py-2 text-sm text-[#121416]">{category.name}</td>
            <td className="px-4 py-2 text-sm">
              <button className="rounded-full bg-[#f1f2f4] px-4 py-1 text-sm font-medium text-[#121416] ">
                {category.status}
              </button>
            </td>
            <td className="px-4 py-2">
              <div
                className="w-10 h-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              />
            </td>
            
            
            <td className="px-4 py-2 text-sm text-[#6a7681] font-bold tracking-wide">
              Edit
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
