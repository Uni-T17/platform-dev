"use client"

import BookCard from "@/components/custom/book-card";
import SearchBar from "@/components/custom/serach-bar";
import WelcomeBox from "@/components/custom/welcome-box";
import { Category, Condition } from "@/lib/model/book";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client"
import { ApiBook } from "@/lib/output/response";
import { BASEURL } from "@/lib/url";

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
    <div className="p-4">
      <WelcomeBox />

      <SearchBar />
      <span className="text-lg font-semibold ml-35 mt-6 mb-4 inline-block">
        Available Books
      </span>

      {loading ? (
        <div className="py-6">Loading books...</div>
      ) : error ? (
        <div className="py-6 text-red-600">{error}</div>
      ) : books.length === 0 ? (
        <div className="py-6">No books available.</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
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
