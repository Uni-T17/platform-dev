"use client"

import BookCard from "@/components/custom/book-card";
import SearchBar from "@/components/custom/serach-bar";
import WelcomeBox from "@/components/custom/welcome-box";
import { Category, Condition } from "@/lib/model/book";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client"
import { ApiBook, ApiResponse } from "@/lib/output/response";

export default function BrowseBook() {

  const [books, setBooks] = useState<ApiBook[]>([])

  useEffect(() => {

    const load = async () => {
      const response = await request("api/v1/user/books/get-all-books", {
        method : "GET",
        credentials : "include"
      })

      const data = await response.json() as ApiResponse

      setBooks(data.booksList)
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

      <div className="flex justify-center gap-8">

        {/* {books.map((book) => (
          <BookCard book={{
            id : book.id.toString(),
            image : `localhost:8080/${book.image}`,
            title : book.title,
            author : book.author,
            credits : book.price,
            

          }} />
        ))} */}

        <BookCard
          book={{
            id: "1",
            image:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            credits: 3,
            description:
              "A novel set in the Jazz Age exploring wealth and illusion.",
            condition: Condition.Good,
            general: "Classic literature about love and tragedy.",
            rating: 4.5,
            category: Category.Children,
            ownerName: "Alice Johnson",
            ownerId: "42",
            status: true,
          }}
        />

        <BookCard
          book={{
            id: "1",
            image:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            credits: 3,
            description:
              "A novel set in the Jazz Age exploring wealth and illusion.",
            condition: Condition.Good,
            general: "Classic literature about love and tragedy.",
            rating: 4.5,
            category: Category.Children,
            ownerName: "Alice Johnson",
            ownerId: "42",
            status: true,
          }}
        />

        <BookCard
          book={{
            id: "1",
            image:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            credits: 3,
            description:
              "A novel set in the Jazz Age exploring wealth and illusion.",
            condition: Condition.Good,
            general: "Classic literature about love and tragedy.",
            rating: 4.5,
            category: Category.Education,
            ownerName: "Alice Johnson",
            status: true,
            ownerId: "42",
          }}
        />
      </div>
    </div>
  );
}
