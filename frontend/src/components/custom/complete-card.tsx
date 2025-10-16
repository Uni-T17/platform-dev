import { CheckCircle } from "lucide-react";
import React from "react";

function CompletedCard({ count }: { count: number }) {
  return (
    <div className="rounded-2xl w-auto border p-6 ">
      <div className="text-slate-600 font-medium">Completed Requests</div>
      <div className="mt-0 text-md font-bold flex items-center justify-between">
        {count}
        <CheckCircle className="text-blue-500 mt-[-24px]" size={30} />
      </div>
    </div>
  );
}

export default CompletedCard;
