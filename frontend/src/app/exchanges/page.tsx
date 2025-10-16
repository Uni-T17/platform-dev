import ActiveCard from "@/components/custom/active-card";
import CompletedCard from "@/components/custom/complete-card";
import { PendingCard } from "@/components/custom/pending-card";

export default function MyExchangesPage() {
  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {/*
            Replace the following dummy values with actual data as needed.
          */}
          <PendingCard count={1} />
          <ActiveCard count={2} />
          <CompletedCard count={3} />
        </div>
      </div>
    </>
  );
}
