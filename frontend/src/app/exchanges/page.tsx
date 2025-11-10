"use client"

import ActiveCard from "@/components/custom/active-card";
import CompletedCard from "@/components/custom/complete-card";
import { PendingCard } from "@/components/custom/pending-card";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { request } from "@/lib/base-client"

type BookExchangesDetails = {
  title : string
  author : string
  from : string
  requestedOn : string
  note : string
  credit : string
  status : string
}
export default function MyExchangesPage() {

  const [pending, setPending] = useState<BookExchangesDetails[]>([])

  useEffect(() => {

    const load = async () => {
      const response = await request("api/v1/user/requests/pending", {
        method : "GET",
        credentials : "include"
      })

      console.log(await response.json())

    }
    load()
  }, [])

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <PendingCard count={1} />
          <ActiveCard count={2} />
          <CompletedCard count={3} />
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full max-w-[1000px] mx-auto py-10">         
          <TabsList className="flex justify-center w-full bg-gray-50 rounded-xl">
            <TabsTrigger className="w-200" value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="flex justify-center w-full mt-4">
              <div className="w-full max-w-4xl">
                <OnPending
                  title="Introduction to Algorithms"
                  author="Thomas H. Cormen"
                  from="Carol Davis"
                  requestedOn="2024-01-25"
                  note="Need this for my computer science course."
                  credit="8"
                  status="Pending Response"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rejected">
          </TabsContent>

          <TabsContent value="complete">
          </TabsContent>

        </Tabs>
    </>
  );
}

export function OnPending({
  title,
  author,
  from,
  requestedOn,
  note,
  credit,
  status,
}: BookExchangesDetails) {
  return (
    <Card className="w-full flex flex-col md:flex-row justify-between items-start md:items-center p-5 border rounded-xl shadow-sm">
      
      <div className="flex-1 space-y-2">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-gray-600 text-sm">by {author}</p>
        </div>

        
        <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
          <span className="flex items-center gap-1 text-gray-700 border px-2 py-0.5 rounded-full bg-gray-50">
            <Clock className="w-4 h-4 text-blue-500" />
            {status}
          </span>
          <span className="text-gray-500">From {from}</span>
        </div>

        
        {note && (
          <div className="bg-gray-50 px-4 py-2 rounded-md mt-2 text-sm italic text-gray-700 border border-gray-100">
            "{note}"
          </div>
        )}

        
        <p className="text-gray-500 text-sm mt-2">
          Requested on {requestedOn}
        </p>
      </div>

      
      <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 md:ml-8">
        <p className="text-red-600 font-semibold text-base">
          {credit} credits
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="h-8 text-sm flex items-center gap-1">
            Edit
          </Button>
          <Button
            variant="outline"
            className="h-8 text-sm border-red-400 text-red-500 hover:bg-red-50 flex items-center gap-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}