"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { primary_color } from "@/app/color";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging; replace with a logging service if desired.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle size={48} color={primary_color} />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-sm text-gray-600">
        An unexpected error occurred. You can try again, and if the problem
        keeps happening please come back in a little while.
      </p>
      <Button
        onClick={() => reset()}
        style={{ backgroundColor: primary_color }}
        className="mt-2"
      >
        Try again
      </Button>
    </div>
  );
}
