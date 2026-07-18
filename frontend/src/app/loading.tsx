import { Loader2 } from "lucide-react";
import { primary_color } from "@/app/color";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 size={40} className="animate-spin" color={primary_color} />
    </div>
  );
}
