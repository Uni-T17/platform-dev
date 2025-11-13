/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
  id: z.preprocess((v) => (v == null ? "" : String(v)), z.string()),
  image: WebImage.optional(),
  title: z.preprocess((v) => (v == null ? "Untitled" : String(v)), z.string()),
  author: z.preprocess((v) => (v == null ? "Unknown" : String(v)), z.string()),
  credits: z.preprocess((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, z.number().int().nonnegative()),
  description: z.preprocess((v) => (v == null ? "" : String(v)), z.string()),
  condition: z.enum(Condition).optional(),
  // rating may be missing or numeric string from backend; coerce and allow 0..5
  rating: z.preprocess((v) => {
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, z.number().min(0).max(5).optional()),
  category: z.enum(Category).optional(),
  ownerName: z.preprocess((v) => (v == null ? "" : String(v)), z.string()), // display name of the lister
  ownerId: z.preprocess((v) => (v == null ? "0" : String(v)), z.string()),
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

  // When validation fails, log detailed info and fall back to a permissive
  // rendering using raw fields (with sensible defaults) so the UI remains usable.
  let props: any;
  if (!result.success) {
    try {
      // Zod errors expose `issues` (array) and a `format()` helper; older
      // code used `errors` which may be undefined and produce empty `{}`
      // when logged. Build a safe, serializable object for console output.
      const serializedError: any = {
        message: result.error?.message,
        issues: Array.isArray((result.error as any)?.issues) ? (result.error as any).issues : undefined,
        formatted: typeof (result.error as any)?.format === "function" ? (result.error as any).format() : undefined,
      };

      // Serialize to avoid Chrome showing collapsed `{}` for live objects
      let errStr: string;
      try {
        errStr = JSON.stringify(serializedError, null, 2);
      } catch (e) {
        errStr = String(serializedError);
      }

      let rawStr: string;
      try {
        rawStr = JSON.stringify(book, (_key, value) => {
          // strip functions and React internals that may cause circular refs
          if (typeof value === "function") return undefined;
          return value;
        }, 2);
      } catch (e) {
        rawStr = String(book);
      }

      console.error("Book schema validation failed:", errStr, "raw:", rawStr);
    } catch (logErr) {
      console.error("Failed to log book validation error", logErr, book);
    }

    // Build a permissive fallback object from the raw book data.
    const raw: any = book || {};
    props = {
      id: raw.id != null ? String(raw.id) : "",
      image: raw.image ?? undefined,
      title: raw.title ?? String(raw.id ?? "Untitled"),
      author: raw.author ?? "Unknown",
      credits: Number(raw.credits) || 0,
      description: raw.description ?? "",
      condition: raw.condition ?? undefined,
      rating: raw.rating != null ? Number(raw.rating) || 0 : 0,
      category: raw.category ?? undefined,
      ownerName: raw.ownerName ?? "",
      ownerId: raw.ownerId != null ? String(raw.ownerId) : "0",
      general: raw.general ?? undefined,
      status: typeof raw.status === "boolean" ? raw.status : undefined,
    };
  } else {
    props = result.data;
  }

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

          {/* Condition + Category badges
          <div className="flex items-center gap-2">
            <Badge className="rounded-md px-3 py-1 text-xs font-semibold bg-green-200 text-green-800">
              {Condition[props.condition]}
            </Badge>
            <Badge className="rounded-md px-3 py-1 text-xs font-semibold bg-white text-black border border-gray-300">
              {Category[props.category as keyof typeof Category]}
            </Badge>
          </div> */}

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
        <Button
          onClick={() => {
            if (isAuth) {
              router.push(`/books/${book.id}`);
            } else {
              openAuth();
            }
          }}
          className="hover:bg-[#1A7A7A] w-full text-white pb-2 px-4 rounded-lg"
          style={{ backgroundColor: primary_color }}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BookCard;
