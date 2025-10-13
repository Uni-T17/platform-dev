"use client"

import Link from "next/link";
import { primary_color } from "@/app/color";
import AuthDialog from "./auth-dialog";
import React, { useState } from "react";
import { useAuthStore } from "@/lib/model/auth-store";
import { CreditCard, User, Wallet } from "lucide-react";

export default function Navbar() {

    const {isAuth} = useAuthStore();
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
            
            <Link href={""}>
                <div className="ms-10 flex items-center">
                    <img src="/logo.png" width={70} height={70}  />
                    <div className="leading-0.5">
                        <h3 style={{color : primary_color}} className="text-xl font-bold">BookEx</h3>
                        <span className="text-sm">Exchange books, expand minds</span>
                    </div>
                </div>
                    
            </Link>
            

            <div>
                <Link className="me-10 font-semibold text-sm p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]"
                    href={""} onClick={requireAuth}>
                    Browse Books
                </Link>
                <Link className="font-semibold p-2 text-sm rounded-md hover:bg-[oklch(0.8_0.12_65)]" 
                    href={"/1"} onClick={requireAuth}>
                    List Books
                </Link>

                {isAuth && 
                    <Link className="ms-10 font-semibold text-sm p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]" 
                        href={""} onClick={requireAuth}>
                        My Exchanges
                    </Link>
                }


            </div>

            {isAuth && 
                    <div className="flex justify-between items-center">
                        <Link className="ms-10 flex gap-2 text-sm font-semibold p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]" 
                        href={""} onClick={requireAuth}>
                        <Wallet size={20} /> Credits
                        </Link>

                        <Link className="ms-10 flex gap-2 text-sm font-semibold p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)]" 
                            href={""} onClick={requireAuth}>
                            <User size={20} /> Profile
                        </Link>
                    </div>
            }

            {!isAuth && 
                <AuthDialog open={authOpen} onOpenChange={setAuthOpen} showTrigger/>
            }
            
        </div>

        <hr className="border-t border-gray-300 my-3" />
    </nav>
  );
}
