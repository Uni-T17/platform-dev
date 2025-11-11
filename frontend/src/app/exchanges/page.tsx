import ActiveCard from "@/components/custom/active-card";
import CompletedCard from "@/components/custom/complete-card";
import { PendingCard } from "@/components/custom/pending-card";
import { Card, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <PendingCard count={1} />
          <ActiveCard count={2} />
          <CompletedCard count={3} />
        </div>
      </div>

      <Tabs className="mx-auto max-w-5xl items-center py-10">
          <TabsList>
            <TabsTrigger className="w-200" value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="complete">Complete</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">

          </TabsContent>

          <TabsContent value="rejected">
          </TabsContent>

          <TabsContent value="complete">
          </TabsContent>

        </Tabs>
    </>
  );
}

function OnPending({title, author, from, requestedOn, note, credit, status} : BookExchangesDetails) {
  return(
    <>
      <Card>
        <CardTitle>{title}</CardTitle>

        <h1>by {author}</h1>
      </Card>
    </>
  )
}