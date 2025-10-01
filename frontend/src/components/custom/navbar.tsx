"use client"

import Link from "next/link";
import { primary_color } from "@/app/color";
import AuthDialog from "./auth-dialog";
import React, { useState } from "react";

export default function Navbar() {

    const isAuth = false;
    const [authOpen, setAuthOpen] = useState(false)

    const requireAuth : React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        if(!isAuth){
            e.preventDefault()
            setAuthOpen(true)
        }
    }

  return (
    <nav className="mb-10 bg-white">
        <div className="h-16 pt-3 ps-20 pe-20 flex justify-between items-center">
            <div className="ms-10 flex items-center">
                
                <img src="/logo.png" width={70} height={70}  />
                <div className="leading-0.5">
                    <h3 style={{color : primary_color}} className="text-xl font-bold">BookEx</h3>
                    <span className="text-sm">Exchange books, expand minds</span>
                </div>
            </div>

            <div>
                <Link className="me-10 font-semibold p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]"
                    href={""} onClick={requireAuth}>
                    Browse Books
                </Link>
                <Link className="font-semibold p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]" 
                    href={""} onClick={requireAuth}>
                    List Books
                </Link>
            </div>

            <AuthDialog open={authOpen} onOpenChange={setAuthOpen} showTrigger/>
            
        </div>

        <hr className="border-t border-gray-300 my-3" />
    </nav>
  );
}
