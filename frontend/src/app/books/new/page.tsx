import BookDetails from "@/components/custom/book-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ListBook() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          className="flex items-center gap-1 rounded-md p-2 text-sm font-semibold hover:bg-[oklch(0.8_0.12_65)]"
          href="/books"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <h1 className="text-lg font-semibold">List a Book</h1>
      </div>

      <div className="flex justify-center">
        <BookDetails />
      </div>
    </div>
  );
}
