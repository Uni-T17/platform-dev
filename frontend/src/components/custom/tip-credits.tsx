import { SketchLogoIcon } from "@radix-ui/react-icons";
import React from "react";

function TipCredits() {
  return (
    <section
      className="max-w-3xl border rounded-lg pl-8  mb-10 shadow-sm items-center mx-auto border-teal-200/60
            bg-gradient-to-r from-teal-50/60 via-amber-50/40 to-cyan-50/60"
    >
      <div className="">
        <div className="flex items-center text-md font-medium gap-2 mt-6 mb-4">
          <SketchLogoIcon className="text-green-600" />
          <h1>Tips for Earning More Credits</h1>
        </div>
        <div>
          <ul className="marker:text-slate-400 list-disc text-black font-normal text-sm ml-4 space-y-2 pb-10">
            <li>List books in excellent condition for higher credit values</li>
            <li>Popular and recent titles tend to be requested more often</li>
            <li>Respond quickly to requests to maintain a good rating</li>
            <li>Take clear photos and write detailed descriptions</li>
            <li>
              Complete exchanges promptly to build trust with the community
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TipCredits;
