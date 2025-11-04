"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Books } from "@/lib/model/dummy-data/book-props";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Wallet } from "lucide-react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useAuthStore } from "@/lib/model/auth-store"; // 👈 add

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuth, openAuth } = useAuthStore(); // 👈 use auth

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
        <div className="grid md:grid-cols-2 gap-4 lg:gap-10">
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
          <div className=" w-full md:w-1/2 space-y-5">
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

            {/* Exchange box */}
            <div className="border rounded-2xl p-5 shadow-sm bg-white space-y-3 w-full sm:w-[360px] md:w-[400px] lg:w-[420px]">
              <div className="flex justify-between items-center">
                <p className="flex gap-2 items-center font-medium text-gray-800 text-md">
                  <Wallet size={20} /> Exchange Information
                </p>
              </div>
              <div className="items-center flex justify-between mb-4">
                <p className="text-sm font-medium">Credit Cost : </p>
                <p className="items-center rounded-md px-2 py-0.5 text-[13px] font-medium border-gray-300 bg-gray-100  text-gray-800">
                  {book.credits} credits
                </p>
              </div>

              {!isAuth ? (
                <>
                  <div className="rounded-2xl border text-sm border-indigo-200 bg-indigo-50 px-2 py-2 text-center text-indigo-800 font-normal">
                    Sign in to request this book and start exchanging!
                  </div>
                  <Button
                    onClick={openAuth}
                    className="w-full bg-[#0F8B8D] hover:bg-[#0d7476] text-white font-semibold rounded-xl"
                  >
                    Sign In to Exchange
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center font-medium text-sm text-gray-700">
                    <span className="font-medium">Your Credits:</span>
                    <span className="inline-flex items-center rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[13px] font-medium">
                      {myCredits} credits
                    </span>
                  </div>
                  <Button
                    disabled={myCredits < book.credits}
                    className="w-full bg-[#1A7A7A] hover:bg-[#166666] text-white font-semibold rounded-xl disabled:opacity-70"
                  >
                    {myCredits < book.credits
                      ? "Not Enough Credits"
                      : "Request This Book"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
