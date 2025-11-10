"use client"

import CreditsUsage from "@/components/custom/credits-usage";
import TipCredits from "@/components/custom/tip-credits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreditState } from "@/lib/model/credit-store";
import { RefreshCcw, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useStore } from "zustand";
import { request } from "@/lib/base-client"

export default function CreditPage() {


    useEffect(() => {
         

        const credit = async () => {

            try{
                const response = await request("api/v1/owner/credits/get-credits", {
                    method : "GET",
                    credentials : "include"
                })

                console.log(await response.json())

            }catch(error) {

            }
        }

    })


    return(
            <section>
                <div className="max-w-3xl mx-auto mt-10 mb-6 flex justify-between">
                    <h1 className="text-xl font-semibold">Credit Wallet</h1>
                    <Button>
                        <RefreshCcw/> Refresh
                    </Button>
                </div>

                <Card className="max-w-3xl mx-auto mt-10 mb-6">
                    <div className="flex gap-3  ms-4">
                        <Wallet/> <span>Current Balance</span>
                    </div>
                    <div>

                    </div>
                </Card>

                <CreditsUsage />
                <TipCredits />
            </section>
    )
}