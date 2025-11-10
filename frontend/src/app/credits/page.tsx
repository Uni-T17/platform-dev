"use client"

import CreditsUsage from "@/components/custom/credits-usage";
import TipCredits from "@/components/custom/tip-credits";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreditState } from "@/lib/model/credit-store";
import { RefreshCcw, Wallet } from "lucide-react";
import { useEffect } from "react";
import { request } from "@/lib/base-client"
import { CreditResponse } from "@/lib/output/response";
import { IconType } from "@/lib/icon";

export default function CreditPage() {

    const {credit, setCredit} = useCreditState();

    useEffect(() => {
         

        const credit = async () => {

            try{
                const response = await request("api/v1/owner/credits/get-credits", {
                    method : "GET",
                    credentials : "include"
                })

                const data = await response.json() as CreditResponse

                setCredit(data.data.balance)
                
            }catch(error) {

            }
        }

        credit()

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
                    <div className="ms-4">
                        <h1 className="text-4xl font-bold mb-4">{credit} Credits</h1>
                        <span>Ready to exchange for new books</span>
                    </div>
                </Card>

                <CreditsUsage />
                <TipCredits />
            </section>
    )
}

function CreditsSecondCard({title, credits, icon} : {title : string, credits : number, icon : IconType}) {
    return(
        <Card>
            <div>
                <div>
                    <h1>{title}</h1>
                    
                </div>
            </div>
        </Card>
    )
}