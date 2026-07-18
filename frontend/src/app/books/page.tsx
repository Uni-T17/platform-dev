"use client"

import BookCard from "@/components/custom/book-card";
import SearchBar from "@/components/custom/serach-bar";
import WelcomeBox from "@/components/custom/welcome-box";
import { Category, Condition } from "@/lib/model/book";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client"
import { ApiBook } from "@/lib/output/response";
import { BASEURL } from "@/lib/url";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseBook() {

  const [books, setBooks] = useState<ApiBook[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch the full book list for browsing
        // Request with a large `limit` so backend returns more than the default 3.
        // The backend paginates and defaults `limit` to 3 in `getPublicBooks`.
        const response = await request("api/v1/user/books/get-all-books?limit=1000", {
          method: "GET",
          credentials: "include",
        })

        const json = await response.json()

        // backend may return books under different keys; prefer booksList
        const list: ApiBook[] = json.booksList ?? json.books ?? json.data?.books ?? json.data?.booksList ?? []

        setBooks(list || [])
      } catch (err: any) {
        console.error("Failed to load books", err)
        setError(err?.message || "Failed to load books")
      } finally {
        setLoading(false)
      }
    }

    load()

  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <WelcomeBox />

      <SearchBar />
      <h2 className="mb-4 mt-6 text-lg font-semibold">Available Books</h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-red-600">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-gray-500">
          No books available yet. Be the first to{" "}
          <a href="/books/new" className="font-medium text-teal-700 hover:underline">
            list one
          </a>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((b) => {
            const image = (() => {
              if (!b.image) return "";
              if (b.image.startsWith("http") || b.image.startsWith("/")) return b.image;
              return `${BASEURL}/${b.image}`;
            })();

            const card = {
              id: b.id.toString(),
              image,
              title: b.title,
              author: b.author,
              credits: Math.max(1, Math.round(b.price || 1)),
              description: "",
              condition: (b.condition as Condition) || undefined,
              rating: 1,
              category: (b.category as Category) || undefined,
              ownerName: "",
              ownerId: "0",
              general: "",
              status: !!b.avaiableStatus,
            };

            return <BookCard key={b.id} book={card} />;
          })}
        </div>
      )}
    </div>
  );
}
