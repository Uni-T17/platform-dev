"use client"

import { Card } from "@/components/ui/card"
import { StarFilledIcon } from "@radix-ui/react-icons"
import { MessagesSquare } from "lucide-react"
import { useEffect, useState } from "react"
import { request } from "@/lib/base-client"

type ReviewCardProps = {
    name : string,
    at : string,
    rating : number, 
    comment : string, 
    bookName : string
}

export default function ViewRating() {

    const [reviews, setReviews] = useState<ReviewCardProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const response = await request("api/v1/owner/reviews/get-all-reviews", {
                    method: "GET",
                    credentials: "include",
                })
                const json = await response.json()
                // json.reviews is expected
                setReviews((json.reviews ?? []).map((r: any) => ({
                    name: r.reviewBy ?? "Unknown",
                    at: r.createdAt ?? "",
                    rating: r.rating ?? 0,
                    comment: r.description ?? "",
                    bookName: r.bookName ?? "",
                })))
            } catch (e: any) {
                console.error(e)
                setError(e?.message ?? "Failed to load reviews")
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    return(
        <section className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-4">My Review</h1>
            <h1>Reviews from users you've exchanged books with</h1>

            {loading && <div className="text-gray-500">Loading reviews…</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && reviews.map((r, i) => (
                <ReviewCard key={i} name={r.name} at={r.at} rating={r.rating} comment={r.comment} bookName={r.bookName} />
            ))}
        </section>
    )
}

function ReviewCard({name, at, rating, comment, bookName} : 
     {name : string, at : string, rating : number, comment : string, bookName : string}  ) {
    return(
        <Card className="ps-8 space-y-1">
            <div className="flex flex-col leading-tight">
                <h1 className="text-base font-semibold m-0 p-0">{name}</h1>
                <span className="text-sm text-gray-500 m-0 p-0">{at}</span>
            </div>


            <div className="flex gap-0.5"> 
                {Array.from({ length: 5 }).map((_, i) => (
                <StarFilledIcon
                    key={i}
                    className={i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
                />
                ))}
            </div>

            <p className="text-[15px] font-medium text-gray-800 m-0">{comment}</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessagesSquare className="w-4 h-4" />
                <span>
                Exchange:{" "}
                <span className="text-blue-700 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">
                    {bookName}
                </span>
                </span>
            </div>
        </Card>
    )
}