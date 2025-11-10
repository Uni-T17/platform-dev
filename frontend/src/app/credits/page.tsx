"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreditsUsage from "@/components/custom/credits-usage";
import TipCredits from "@/components/custom/tip-credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Star,
  Plus,
  History,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
} from "lucide-react";
import { UserProfileDetails } from "@/lib/output/response";
import DeleteRequest from "@/components/custom/delete-request";

export default function CreditPage() {
  const router = useRouter();
  const [info, setInfo] = useState<UserProfileDetails>();

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <DeleteRequest />

      {/* Current Balance Card - Smaller Size */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">
                  Current Balance
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {info?.creditsBalance || 15} Credits
                </h2>
                <p className="text-gray-600 text-sm">
                  Ready to exchange for new books
                </p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900">
                  {info?.profileCard.rating || "4.8"}
                </span>
              </div>
              <p className="text-gray-600 text-xs">Your rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Earned */}
        <Card className="border border-gray-200 rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-1">
                  Total Earned
                </p>
                <p className="text-lg font-bold text-green-600">12 Credits</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card className="border border-gray-200 rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-1">
                  Total Spent
                </p>
                <p className="text-lg font-bold text-red-600">10 Credits</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchanges */}
        <Card className="border border-gray-200 rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs font-medium mb-1">
                  Exchanges
                </p>
                <p className="text-lg font-bold text-gray-900">5</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <RefreshCcw className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <CreditsUsage />
        <TipCredits />
      </div>
    </div>
  );
}
