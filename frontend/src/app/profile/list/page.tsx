"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { request } from "@/lib/base-client"
import { useUserIdStore } from "@/lib/model/user-id-store"
import { ApiBook } from "@/lib/output/response"
import { BASEURL } from "@/lib/url"

type OwnerBookResponse = {
  message: string
  isOwner: boolean
  totalBook: number
  booksList: ApiBook[]
}

const IMAGE_BASE =`${BASEURL}/`

// 🟢 Condition + Category Labels
const CONDITION_LABEL: Record<string, string> = {
  LIKENEW: "Like New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
}

const CATEGORY_LABEL: Record<string, string> = {
  FICTION: "Fiction",
  NONFICTION: "Non-Fiction",
  TEXTBOOK: "Textbook",
  SCIENCE: "Science",
  HISTORY: "History",
  BUSINESS: "Business",
  ART: "Art",
  COOKING: "Cooking",
  CHILDREN: "Children",
  OTHER: "Other",
}

// 🟢 Conditional Badge Colors
const conditionClass: Record<string, string> = {
  LIKENEW: "bg-emerald-100 text-emerald-800",
  LIKE_NEW: "bg-emerald-100 text-emerald-800",
  GOOD: "bg-emerald-100 text-emerald-800",
  FAIR: "bg-amber-100 text-amber-800",
  POOR: "bg-rose-100 text-rose-800",
}

export default function ViewBookDetails() {
  const { id } = useUserIdStore()
  const [books, setBooks] = useState<ApiBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await request(`api/v1/user/books/get-user-books/${id}`, {
          method: "GET",
          credentials: "include",
        })
        const data: OwnerBookResponse = await res.json()
        console.log("[Profile Books] fetched:", data)
        setBooks(data.booksList ?? [])
      } catch (err: any) {
        setError(err.message ?? "Failed to load books")
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  return (
    <section className="mx-auto max-w-6xl">
      <h1 className="text-xl font-bold mb-2">My Listed Books</h1>
      <p className="text-gray-600 mb-8">
        Manage your listed books. You can delete books that are no longer available.
      </p>

      {loading && (
        <div className="text-center text-gray-500 py-10">Loading books…</div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}
      {!loading && books.length === 0 && (
        <div className="text-center text-gray-500">No books listed.</div>
      )}

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCardItem key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}

// ✅ Individual Book Card Component
function BookCardItem({ book }: { book: ApiBook }) {
  const img = `${IMAGE_BASE}/${book.image}`
  const condLabel = CONDITION_LABEL[book.condition] ?? book.condition
  const catLabel = CATEGORY_LABEL[book.category] ?? book.category
  const condCls = conditionClass[book.condition] ?? "bg-gray-100 text-gray-700"

  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm w-full max-w-[360px] mx-auto">
      <div className="relative w-full h-[420px]">
        <img
          src={img}
          alt={book.title}
          className="w-full h-full object-cover"
        />

        {/* Availability badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold shadow ${
              book.avaiableStatus
                ? "bg-teal-700 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {book.avaiableStatus ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-gray-900 shadow">
            {book.price} credits
          </span>
        </div>
      </div>

      <CardContent className="px-5 pt-5 space-y-3">
        <div className="space-y-1">
          <h3 className="text-[18px] font-semibold text-gray-900">
            {book.title}
          </h3>
          <p className="text-[15px] text-teal-700">by {book.author}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={`rounded-md px-3 py-1 text-xs font-semibold ${condCls}`}>
            {condLabel}
          </Badge>
          <Badge className="rounded-md px-3 py-1 text-xs font-semibold bg-white text-black border border-gray-300">
            {catLabel}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button
          variant="destructive"
          className="w-full h-11 rounded-xl text-[15px] font-semibold"
          onClick={() => handleDelete(book.id)}
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Delete Book
        </Button>
      </CardFooter>
    </Card>
  )
}

// 🗑️ Delete handler
async function handleDelete(id: number) {
  if (!confirm("Are you sure you want to delete this book?")) return
  try {
    await request(`api/v1/owner/books/delete-book/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    alert("Book deleted successfully!")
    window.location.reload()
  } catch (e: any) {
    alert("Failed to delete: " + (e.message ?? "Unknown error"))
  }
}