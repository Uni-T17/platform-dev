import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";

function CreditsUsage() {
  return (
    <section className=" max-w-3xl border rounded-lg pl-8 pt-4  mt-10 mb-10 shadow-sm items-center mx-auto ">
      <h1 className="mb-6 text-md font-medium ml-0.5">How Credits Work</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 mb-4">
        <div className=" sm:*:w-[320px] md:w-[500px]">
          <div className="flex items-center gap-2 font-bold pb-4 pl-0.5 ">
            <PlusIcon className="text-green-500" />
            <h1>Earning Credits</h1>
          </div>
          <ul className="marker:text-slate-400 list-disc text-gray-500 font-normal text-sm ml-4 space-y-2">
            <li>List a book and earn credits when someone requests it</li>
            <li>Credits earned depend on book condition and demand</li>
            <li> Higher quality books earn more credits</li>
            <li>Complete exchanges to maintain good rating</li>
          </ul>
        </div>

        <div className="w-[320px]">
          <div className="flex items-center gap-2 font-bold pb-4 pl-0.5">
            <MinusIcon className="text-red-500" />
            <h1>Spending Credits</h1>
          </div>
          <ul className="marker:text-slate-400 list-disc text-gray-500 font-normal text-sm ml-4  space-y-2">
            <li>Request books from other members</li>
            <li>Credit cost varies by book condition and rarity</li>
            <li>Credits are deducted when exchange is confirmed</li>
            <li>Rate your exchange partner to build trust</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CreditsUsage;
