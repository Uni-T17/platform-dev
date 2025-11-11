import BookDetails from "@/components/custom/book-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ListBook() {
  return (
    <>
      <div className="flex justify-center items-center pb-4">
        <Link
          className="me-10 font-semibold text-sm p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]"
          href={"/"}
        >
          <div className="flex items-center ">
            <ArrowLeft /> Back
          </div>
        </Link>

        <span>Book List</span>
      </div>

      <div className="flex justify-center">
        <BookDetails />
      </div>

      <div className="mt-4"></div>
    </>
  );
}
