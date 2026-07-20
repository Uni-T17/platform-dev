import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { primary_color } from "@/app/color";

/** Small inline spinner for buttons and tight spaces. */
export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

/** Centered spinner with an optional message — use while a whole page/section loads. */
export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 size={36} className="animate-spin" color={primary_color} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

/** Skeleton placeholders shaped like a vertical list of cards (exchanges, reviews...). */
export function CardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border p-5 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton placeholders shaped like stat cards in a responsive grid. */
export function StatCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      ))}
    </div>
  );
}
