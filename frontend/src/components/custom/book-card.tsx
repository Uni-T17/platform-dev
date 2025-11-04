/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Category, Condition } from "@/lib/model/book";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { primary_color } from "@/app/color";
import { AspectRatio } from "../ui/aspect-ratio";
import { useAuthStore } from "@/lib/model/auth-store";

const WebImage = z.union([z.string().url(), z.string().startsWith("/")]);

export const BookSchema = z.object({
  id: z.string(),
  image: WebImage.optional(),
  title: z.string(),
  author: z.string(),
  credits: z.number().int().positive(),
  description: z.string(),
  condition: z.enum(Condition),
  rating: z.number().min(1).max(5),
  category: z.enum(Category),
  ownerName: z.string(), // display name of the lister
  ownerId: z.string(),
  general: z.string().optional(),
  status: z.boolean().optional(),
});

export type BookType = z.infer<typeof BookSchema>;

type Props = { book: BookType };

function BookCard({ book }: Props) {
  const { isAuth, authOpen, openAuth } = useAuthStore();

  const result = BookSchema.safeParse(book);
  const router = useRouter();
  const handleView = () => router.push(`/books/${book.id}`);

  if (!result.success) {
    console.error(result.error.flatten());
    return (
      <Card className="p-4 border border-red-400 text-red-600">
        Invalid book data.
      </Card>
    );
  }

  const props = result.data;

  return (
    <Card className="  p-0 cursor-pointer overflow-hidden grid rounded-2xl border shadow-sm w-[320px] h-[650px] ">
      <CardHeader className="space-y-1 p-0 relative">
        <div className="absolute right-3 top-3 z-10 rounded-lg bg-white/95 px-2 py-0.5 text-sm font-medium text-black shadow">
          {props.credits} credits
        </div>
        <AspectRatio ratio={4 / 5} className="w-full rounded- overflow-hidden">
          <img
            src={props.image}
            alt={props.title}
            className="w-full h-full object-cover "
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="space-y-4 px-4">
        <div className="space-y-3 pt-4">
          {/* Name + Author */}
          <div className="space-y-1 font-medium">
            <span className="text-[17px] font-semibold text-black flex">
              {props.title}
            </span>
            <span className="text-gray-500 text-[15px]">by {props.author}</span>
          </div>

          {/* Condition + Category badges */}
          <div className="flex items-center gap-2">
            <Badge className="rounded-md px-3 py-1 text-xs font-semibold bg-green-200 text-green-800">
              {Condition[props.condition]}
            </Badge>
            <Badge className="rounded-md px-3 py-1 text-xs font-semibold bg-white text-black border border-gray-300">
              {Category[props.category as keyof typeof Category]}
            </Badge>
          </div>

          {/* Rating row */}
          {(props.rating ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-slate-700 flex-wrap">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
              <span className="font-semibold text-[15px]">
                {props.rating.toFixed(1)}
              </span>

              {props.ownerName && (
                <div className="flex items-center gap-1 text-[15px] text-gray-600">
                  <span>• by</span>
                  <Link
                    href={`/profile/${props.ownerId}`}
                    className="text-teal-700 font-medium hover:underline"
                  >
                    {props.ownerName}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Button footer */}
      <CardFooter className="mt-auto flex justify-between items-center px-4 pb-4">
        <Link href={`/books/${book.id}`} className="w-full">
          <Button
            className=" hover:bg-[#1A7A7A] w-full text-white pb-2 px-4 rounded-lg"
            style={{ backgroundColor: primary_color }}
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default BookCard;
