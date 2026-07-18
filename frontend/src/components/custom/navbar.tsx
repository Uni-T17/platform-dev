"use client";

import Link from "next/link";
import Image from "next/image";
import { primary_color } from "@/app/color";
import AuthDialog from "./auth-dialog";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/model/auth-store";
import { LogOut, Menu, User, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/books", label: "Browse Books", auth: false },
  { href: "/books/new", label: "List Books", auth: false },
  { href: "/exchanges", label: "My Exchanges", auth: true },
];

export default function Navbar() {
  const { isAuth, authOpen, openAuth, closeAuth, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auth state is persisted (localStorage); wait for mount to avoid a
  // server/client hydration mismatch on auth-dependent UI.
  useEffect(() => setMounted(true), []);
  const authed = mounted && isAuth;

  const requireAuth =
    (href: string): React.MouseEventHandler =>
    (e) => {
      if (!isAuth) {
        e.preventDefault();
        openAuth();
      } else {
        router.push(href);
      }
    };

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    toast.success("Signed out");
    router.push("/");
  };

  const linkClass =
    "font-semibold text-sm p-2 rounded-md hover:bg-[oklch(0.8_0.12_65)] transition-colors";

  return (
    <nav className="mb-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/books" className="flex items-center gap-2">
          <Image src="/logo.png" alt="BookEx logo" width={48} height={48} priority />
          <div className="leading-tight">
            <h3 style={{ color: primary_color }} className="text-lg font-bold">
              BookEx
            </h3>
            <span className="hidden text-xs text-gray-500 sm:block">
              Exchange books, expand minds
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((l) => !l.auth || authed)
            .map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={requireAuth(l.href)}
                className={linkClass}
              >
                {l.label}
              </Link>
            ))}

          {authed && (
            <>
              <Link
                href="/credits"
                onClick={requireAuth("/credits")}
                className={`${linkClass} flex items-center gap-1`}
              >
                <Wallet size={18} /> Credits
              </Link>
              <Link
                href="/profile"
                onClick={requireAuth("/profile")}
                className={`${linkClass} flex items-center gap-1`}
              >
                <User size={18} /> Profile
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-semibold"
              >
                <LogOut size={18} /> Sign Out
              </Button>
            </>
          )}

          {mounted && !isAuth && (
            <AuthDialog
              open={authOpen}
              onOpenChange={(isOpen) => (isOpen ? openAuth() : closeAuth())}
              showTrigger
            />
          )}
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && !isAuth && (
            <AuthDialog
              open={authOpen}
              onOpenChange={(isOpen) => (isOpen ? openAuth() : closeAuth())}
              showTrigger
            />
          )}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle style={{ color: primary_color }}>BookEx</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-2">
                {navLinks
                  .filter((l) => !l.auth || authed)
                  .map((l) => (
                    <SheetClose asChild key={l.href}>
                      <Link
                        href={l.href}
                        onClick={requireAuth(l.href)}
                        className={linkClass}
                      >
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}

                {authed && (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/credits"
                        onClick={requireAuth("/credits")}
                        className={`${linkClass} flex items-center gap-2`}
                      >
                        <Wallet size={18} /> Credits
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        onClick={requireAuth("/profile")}
                        className={`${linkClass} flex items-center gap-2`}
                      >
                        <User size={18} /> Profile
                      </Link>
                    </SheetClose>
                    <button
                      onClick={handleLogout}
                      className={`${linkClass} flex items-center gap-2 text-left`}
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
