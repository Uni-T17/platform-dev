import { CheckCircle } from "lucide-react";
import React from "react";

function CompletedCard({
  count,
  onClick,
  active,
}: {
  count: number;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl w-auto border p-6 text-left hover:shadow-sm focus:outline-none ${
        active ? "ring-2 ring-teal-300" : ""
      }`}
    >
      <div className="text-slate-600 font-medium">Completed Requests</div>
      <div className="mt-0 text-md font-bold flex items-center justify-between">
        {count}
        <CheckCircle className="text-blue-500 mt-[-24px]" size={30} />
      </div>
    </button>
  );
}

export default CompletedCard;
