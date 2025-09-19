export default function StatusBadge({ status }) {
  const colorMap = {
    order_created: "bg-blue-100 text-blue-800",
    assigned_to_designer: "bg-indigo-100 text-indigo-800",
    designing_started: "bg-yellow-100 text-yellow-800",
    design_completed: "bg-green-100 text-green-800",
    design_won: "bg-emerald-100 text-emerald-800",
    design_rejected: "bg-red-100 text-red-800",
    assigned_to_printer: "bg-purple-100 text-purple-800",
    printing_started: "bg-orange-100 text-orange-800",
    printing_finished: "bg-green-100 text-green-800",
    assigned_to_shipping: "bg-cyan-100 text-cyan-800",
    out_for_delivery: "bg-pink-100 text-pink-800",
    order_delivered: "bg-teal-100 text-teal-800",
    pending: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorMap[status] || colorMap.pending}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
