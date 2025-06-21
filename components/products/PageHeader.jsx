import { Button } from "@/components/ui/button";

export default function PageHeader({ title, actionLabel }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 py-2">
      <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">
        {title}
      </p>
      <Button className="rounded-full bg-[#f1f2f4] text-[#121416] h-8 px-4 text-sm font-medium">
        {actionLabel}
      </Button>
    </div>
  );
}
