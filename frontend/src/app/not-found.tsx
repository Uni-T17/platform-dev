import Link from "next/link";
import { Button } from "@/components/ui/button";
import { primary_color } from "@/app/color";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <BookOpen size={48} color={primary_color} />
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-sm text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild style={{ backgroundColor: primary_color }} className="mt-2">
        <Link href="/books">Browse books</Link>
      </Button>
    </div>
  );
}
