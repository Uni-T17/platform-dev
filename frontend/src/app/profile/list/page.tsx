"use client"

import { Card } from "@/components/ui/card"
import { ApiBook } from "@/lib/output/response"
import { useEffect } from "react"
import { request } from "@/lib/base-client"

type OwnerBookResponse = {
    message : string,
    isOwner : boolean,
    totalBook : number,
    booksList : ApiBook[]
}

export default function ViewBookDetails() {


    useEffect(() => {

        const load = async () => {
            const response = await request("api/v1/user/books/get-user-books")
        }
    },[])


    return(
        <section className="mx-auto max-w-5xl">
            <h1 className="text-xl font-bold mb-4">My Listed Books</h1>
            <span>Manage your book listings. You can delete books that are no longer available.</span>
            

            <Card>

            </Card>
        </section>
    )
}