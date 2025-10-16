import { PieChart } from "lucide-react";
import React from "react";

function ActiveCard({ count }: { count: number }) {
  return (
    <div className="rounded-2xl w-auto border p-6 ">
      <div className="text-slate-600 font-medium">Active Requests</div>
      <div className="mt-0 text-md font-bold flex items-center justify-between">
        {count}
        <PieChart className="text-green-500 mt-[-24px]" size={30} />
      </div>
    </div>
  );
}

export default ActiveCard;
