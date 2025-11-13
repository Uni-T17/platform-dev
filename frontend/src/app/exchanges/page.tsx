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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type BookExchangesDetails = {
  title : string
  author : string
  from : string
  requestedOn : string
  note : string
  credit : string
  status : string
  onView?: () => void
}
export default function MyExchangesPage() {
  
  // 'owner-active' = owner incoming (pending + accepted),
  // 'owner-complete' = owner history (accepted)
  const [selected, setSelected] = useState<"user" | "owner-active" | "owner-complete">("user");

  const [pending, setPending] = useState<BookExchangesDetails[]>([]);
  const [rejected, setRejected] = useState<BookExchangesDetails[]>([]);
  const [complete, setComplete] = useState<BookExchangesDetails[]>([]);

  // owner-side raw lists (preserve buyer and requestDetail shapes)
  const [ownerPending, setOwnerPending] = useState<any[]>([]);
  const [ownerAccepted, setOwnerAccepted] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const openOwnerDetail = (item: any) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pRes, aRes, rRes] = await Promise.all([
          request("api/v1/user/requests/pending", { method: "GET", credentials: "include" }),
          request("api/v1/user/requests/approve", { method: "GET", credentials: "include" }),
          request("api/v1/user/requests/reject", { method: "GET", credentials: "include" }),
        ]);

        const pJson = await pRes.json();
        const aJson = await aRes.json();
        const rJson = await rRes.json();

        const mapRequests = (list: any[] | undefined): BookExchangesDetails[] => {
          if (!list) return [];
          return list.map((item: any) => ({
            title: item.book?.title ?? "",
            author: item.book?.author ?? "",
            from: item.seller?.name ?? item.buyer?.name ?? "",
            requestedOn: item.requestDetail?.requestedAt ?? item.requestedAt ?? "",
            note: item.requestDetail?.message ?? item.message ?? "",
            credit: String(item.requestDetail?.requestedPrice ?? item.requestedPrice ?? "0"),
            status: item.requestDetail?.requestedStatus ?? item.requestedStatus ?? "",
          }));
        };

        setPending(mapRequests(pJson.myRequestLists ?? []));
        setComplete(mapRequests(aJson.myRequestLists ?? []));
        setRejected(mapRequests(rJson.myRequestLists ?? []));
      } catch (e: any) {
        console.error("Failed to load exchanges", e);
        setError(e?.message ?? "Failed to load exchanges");
      } finally {
        setLoading(false);
      }
    };

    const loadOwner = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pRes, aRes] = await Promise.all([
          request("api/v1/owner/requests/incoming-pending", { method: "GET", credentials: "include" }),
          request("api/v1/owner/requests/incoming-approve", { method: "GET", credentials: "include" }),
        ]);

        const pJson = await pRes.json();
        const aJson = await aRes.json();

        setOwnerPending(pJson.myRequestLists ?? []);
        setOwnerAccepted(aJson.myRequestLists ?? []);
      } catch (e: any) {
        console.error("Failed to load owner exchanges", e);
        setError(e?.message ?? "Failed to load exchanges");
      } finally {
        setLoading(false);
      }
    };

    // choose loader based on selection
    if (selected === "user") {
      loadUser();
    } else {
      // owner-active or owner-complete both need owner lists
      loadOwner();
    }
    // reloadKey allows manual refresh after actions
  }, [selected, reloadKey]);

  // modal state for owner detail
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<any | null>(null);

  const processRequest = async (requestId: number, status: "APPROVE" | "REJECT") => {
    try {
      await request("api/v1/owner/requests/update-request", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, avaiableStatus: status }),
      });
      // refresh lists
      setReloadKey((k) => k + 1);
      setDetailOpen(false);
    } catch (e: any) {
      console.error("Failed to process request", e);
      // show error in modal (simple alert for now)
      alert(e?.message ?? "Failed to process request");
    }
  };
  

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <PendingCard count={pending.length} onClick={() => setSelected("user")} active={selected === "user"} />
          <ActiveCard count={ownerAccepted.length} onClick={() => setSelected("owner-active")} active={selected === "owner-active"} />
          <CompletedCard count={ownerAccepted.length} onClick={() => setSelected("owner-complete")} active={selected === "owner-complete"} />
        </div>
      </div>

      {/* Content area varies depending on selected mode */}
      {selected === "user" && (
        <Tabs defaultValue="pending" className="w-full max-w-[1000px] mx-auto py-10">         
          <TabsList className="flex justify-center w-full bg-gray-50 rounded-xl">
            <TabsTrigger className="w-200" value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>

              <TabsContent value="pending">
                <div className="flex justify-center w-full mt-4">
                  <div className="w-full max-w-4xl space-y-4">
                    {loading && <div className="text-gray-500">Loading…</div>}
                    {error && <div className="text-red-600">{error}</div>}
                    {!loading && pending.length === 0 && <div className="text-gray-500">No pending requests.</div>}
                    {!loading && pending.map((p, i) => (
                      <OnPending key={i} {...p} />
                    ))}
                  </div>
                </div>
              </TabsContent>

          <TabsContent value="rejected">
            <div className="flex justify-center w-full mt-4">
              <div className="w-full max-w-4xl space-y-4">
                {!loading && rejected.length === 0 && <div className="text-gray-500">No rejected requests.</div>}
                {!loading && rejected.map((r, i) => (
                  <OnPending key={i} {...r} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="complete">
            <div className="flex justify-center w-full mt-4">
              <div className="w-full max-w-4xl space-y-4">
                {!loading && complete.length === 0 && <div className="text-gray-500">No completed requests.</div>}
                {!loading && complete.map((c, i) => (
                  <OnPending key={i} {...c} />
                ))}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      )}

      {selected === "owner-active" && (
        <Tabs defaultValue="pending" className="w-full max-w-[1000px] mx-auto py-10">         
          <TabsList className="flex justify-center w-full bg-gray-50 rounded-xl">
            <TabsTrigger className="w-200" value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="flex justify-center w-full mt-4">
              <div className="w-full max-w-4xl space-y-4">
                {loading && <div className="text-gray-500">Loading…</div>}
                {error && <div className="text-red-600">{error}</div>}
                {!loading && ownerPending.length === 0 && <div className="text-gray-500">No incoming pending requests.</div>}
                {!loading && ownerPending.map((item: any, i: number) => (
                  <OnPending key={i}
                    title={item.book?.title ?? ""}
                    author={item.book?.author ?? ""}
                    from={item.buyer?.name ?? ""}
                    requestedOn={item.requestDetail?.requestedAt ?? ""}
                    note={item.requestDetail?.message ?? ""}
                    credit={String(item.requestDetail?.requestedPrice ?? "0")}
                    status={item.requestDetail?.requestedStatus ?? ""}
                    // pass raw data via data-* props by using data attribute or closure: we use onView below
                    onView={() => openOwnerDetail(item)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accepted">
            <div className="flex justify-center w-full mt-4">
              <div className="w-full max-w-4xl space-y-4">
                {!loading && ownerAccepted.length === 0 && <div className="text-gray-500">No accepted requests.</div>}
                {!loading && ownerAccepted.map((item: any, i: number) => (
                  <OnPending key={i}
                    title={item.book?.title ?? ""}
                    author={item.book?.author ?? ""}
                    from={item.buyer?.name ?? ""}
                    requestedOn={item.requestDetail?.requestedAt ?? ""}
                    note={item.requestDetail?.message ?? ""}
                    credit={String(item.requestDetail?.requestedPrice ?? "0")}
                    status={item.requestDetail?.requestedStatus ?? ""}
                    onView={() => openOwnerDetail(item)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {selected === "owner-complete" && (
        <div className="flex justify-center w-full mt-4">
          <div className="w-full max-w-4xl space-y-4">
            {loading && <div className="text-gray-500">Loading…</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && ownerAccepted.length === 0 && <div className="text-gray-500">No history.</div>}
            {!loading && ownerAccepted.map((item: any, i: number) => (
              <OnPending key={i}
                title={item.book?.title ?? ""}
                author={item.book?.author ?? ""}
                from={item.buyer?.name ?? ""}
                requestedOn={item.requestDetail?.requestedAt ?? ""}
                note={item.requestDetail?.message ?? ""}
                credit={String(item.requestDetail?.requestedPrice ?? "0")}
                status={item.requestDetail?.requestedStatus ?? ""}
                onView={() => openOwnerDetail(item)}
              />
            ))}
          </div>
        </div>
      )}
      {/* Owner detail modal */}
      <RequestDetailDialog open={detailOpen} onOpenChange={setDetailOpen} item={detailItem} onProcess={processRequest} />
    </>
  );
}

// Render detail dialog outside main flow so it's available for owner items
// (we render it conditionally from the page via state)
function RequestDetailDialog({
  open,
  onOpenChange,
  item,
  onProcess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: any | null;
  onProcess: (requestId: number, status: "APPROVE" | "REJECT") => void;
}) {
  if (!item) return null;

  const buyer = item.buyer;
  const book = item.book;
  const detail = item.requestDetail;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>Review the request information and contact details before accepting or declining.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{book?.title}</h3>
            <p className="text-sm text-gray-600">by {book?.author}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-gray-50 text-sm">{detail?.requestedStatus}</span>
              <span className="text-gray-500">Requested on {detail?.requestedAt}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="font-semibold">Requester: {buyer?.name}</div>
            <div className="text-sm text-gray-700">Contact: {buyer?.contactInfo?.email}{buyer?.contactInfo?.phone ? `, ${buyer.contactInfo.phone}` : ''}</div>
            <div className="mt-2 font-semibold">Credits Offered: <span className="text-green-600">+{detail?.requestedPrice} credits</span></div>
          </div>

          {detail?.message && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="font-semibold">Message from requester:</div>
              <div className="italic mt-2">"{detail.message}"</div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-4">
            <Button onClick={() => onProcess(detail.requestId, "APPROVE")} className="bg-teal-600 text-white">Accept Request</Button>
            <Button variant="outline" onClick={() => onProcess(detail.requestId, "REJECT")}>Decline</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  onView,
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
          {onView && (
            <Button variant="outline" onClick={onView} className="h-8 text-sm flex items-center gap-1">
              View Details
            </Button>
          )}
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