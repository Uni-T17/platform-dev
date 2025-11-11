"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/model/auth-store";
import { Button } from "../ui/button";
import { Books } from "@/lib/model/dummy-data/book-props";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import RequestForm from "@/components/custom/request-form";
import { Category, Condition } from "@/lib/model/book";

export default function ExchangedInformation() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuth, openAuth } = useAuthStore();

  const book = Books.find((b) => b.id === id);
  if (!book) return <p className="text-center mt-10">Book not found</p>;

  const myCredits = 15;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = React.useState(false);

  return (
    <div className="border rounded-2xl p-5 shadow-sm bg-white space-y-3 w-full sm:w-[360px] md:w-[400px] lg:w-[420px]">
      <div className="flex justify-between items-center">
        <p className="flex gap-2 items-center font-medium text-gray-800 text-md">
          <Wallet size={20} /> Exchange Information
        </p>
      </div>

      <div className="items-center flex justify-between mb-4">
        <p className="text-sm font-medium">Credit Cost :</p>
        <p className="rounded-md px-2 py-0.5 text-[13px] font-medium border-gray-300 bg-gray-100 text-gray-800">
          {book.credits} credits
        </p>
      </div>

      {!isAuth ? (
        <>
          <div className="rounded-2xl border text-sm border-indigo-200 bg-indigo-50 px-2 py-2 text-center text-indigo-800">
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
            <span>Your Credits:</span>
            <span className="inline-flex items-center rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[13px] font-medium">
              {myCredits} credits
            </span>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={myCredits < book.credits}
                className="w-full bg-[#1A7A7A] hover:bg-[#166666] text-white font-semibold rounded-xl disabled:opacity-70"
              >
                {myCredits < book.credits
                  ? "Not Enough Credits"
                  : "Request This Book"}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request &quot;{book.title}&quot;</DialogTitle>
                <DialogDescription>
                  Send a request to the book owner to exchange this book.
                </DialogDescription>
              </DialogHeader>
              {/* Form body */}
              <RequestForm
                book={{
                  id: book.id,
                  image: book.image,
                  title: book.title,
                  author: book.author,
                  credits: book.credits,
                  description: book.description,
                  condition: book.condition,
                  general: book.general,
                  rating: book.rating,
                  category: book.category,
                  status: false,
                  ownerId: "",
                  ownerName: "",
                }}
                myCredits={myCredits}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
