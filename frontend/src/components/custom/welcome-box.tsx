"use client";
import React, { useState } from "react";
import AuthDialog from "./auth-dialog";
import { useAuthStore } from "@/lib/model/auth-store";
import { is } from "zod/v4/locales";
import Link from "next/link";
import { Button } from "../ui/button";
import { primary_color } from "@/app/color";
import { Book, CreditCard, PersonStandingIcon, PlusIcon, User } from "lucide-react";

function WelcomeBox() {
  const { isAuth } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div
      className="mx-auto my-6 w-full
            max-w-5xl                    
            rounded-2xl
            border border-teal-200/60
            bg-gradient-to-r from-teal-50/60 via-amber-50/40 to-cyan-50/60
            px-6 py-8 md:px-16 md:py-12   
            text-center shadow-sm
            min-h-[220px]"
    >
      <div className="justify-center flex">
        <img
          src="logo.png"
          alt="logo"
          className="w-30 h-30 bg-muted-foreground rounded-full"
        />
      </div>
      {isAuth ? (
        <div className="">
          <p
            className="text-md font-medium mt-4 mb-2"
            style={{ color: primary_color }}
          >
            Welcome Back, Book Lover!
          </p>
          <p className="text-md font-medium text-gray-600">
            Ready to discover your next great read? Browse available books or
            list one of your own to earn credits.
          </p>
          <div className="justify-center items-center flex gap-4 mt-4">
            <Link href={""}>
              <Button
                className=" hover:bg-[#1A7A7A]  text-white pb-2 px-2 rounded-lg"
                style={{ backgroundColor: primary_color }}
              >
                {" "}
                <PlusIcon /> List a Book
              </Button>
            </Link>
            <Link href={""}>
              <Button className="bg-white hover:bg-[#F1FBF9] text-black pb-2 px-2 rounded-lg border border-gray-300">
                {" "}
                <CreditCard /> My Credits{" "}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="m-0">
          <h1
            className="text-md font-medium mt-4 mb-2"
            style={{ color: primary_color }}
          >
            Welcome to BookEx!
          </h1>
          <p className="text-md font-medium text-gray-600">
            Exchange books, expand minds. Join our community of readers and
            discover your next favorite book through our credit-based exchange
            system.
          </p>

          <div className="pt-4 flex justify-center items-center gap-4">
            <Link href={""}>
              <Button
                className="bg-white hover:bg-[#F1FBF9] text-black pb-2 px-2 rounded-lg border border-gray-300"
                onClick={() => setAuthOpen(true)}
              >
                {" "}
                <User /> Join BookEx{" "}
              </Button>
            </Link>

            {!isAuth && (
              <AuthDialog
                open={authOpen}
                onOpenChange={setAuthOpen}
                showTrigger
                icon={Book}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomeBox;
