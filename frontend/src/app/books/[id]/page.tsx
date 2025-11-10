"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Books } from "@/lib/model/dummy-data/book-props";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Wallet } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useAuthStore } from "@/lib/model/auth-store";
import ExchangedInformation from "@/components/custom/exchanged-information";
import RequestForm from "@/components/custom/request-form";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuth, openAuth } = useAuthStore();

  const book = Books.find((b) => b.id === id);
  if (!book) return <p className="text-center mt-10">Book not found</p>;

  // replace with real credits when wired
  const myCredits = 15;

  return (
    <div className="mx-24">
      <div>
        <Button
          onClick={() => router.back()}
          className=" mb-4 flex items-center gap-2 bg-[#fafafa] hover:bg-[#F2B77E] text-black font-semibold shadow-sm border border-gray-200 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Button>
      </div>

      <div className="grid place-items-center">
        <div className="grid md:grid-cols-2 gap-2 lg:gap-4">
          {/* LEFT */}
          <div className="w-sm  flex justify-center">
            <AspectRatio
              ratio={4 / 5}
              className="w-full rounded-2xl overflow-hidden"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>

          {/* RIGHT */}
          <div className=" w-full  md:w-1/2 space-y-5">
            <div>
              <h1 className="text-md md:text-md font-bold text-gray-900">
                {book.title}
              </h1>
              <p className="text-md text-gray-600">by {book.author}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                {book.condition}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700">
                {book.category}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800">
                {book.credits} credits
              </Badge>
            </div>

            {!!book.rating && (
              <div className="flex flex-wrap items-center gap-2 text-slate-700 text-[15px]">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                <span className="font-semibold">{book.rating.toFixed(1)}</span>
                <span className="text-gray-600">• Listed by</span>
                <Link
                  href={`/profile/${book.ownerId}`}
                  className="text-teal-700 font-medium hover:underline"
                >
                  {book.ownerName}
                </Link>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-md text-gray-900">
                Description
              </h2>
              <p className="text-gray-700 text-md">{book.description}</p>
            </div>

            <ExchangedInformation />
          </div>
        </div>
      </div>
    </div>
  );
}
