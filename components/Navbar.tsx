"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignUpButton } from "@clerk/nextjs";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-6 gap-4 h-16  border-b border-[#1A1325] sticky top-0 z-50">
      {/* Logo / Brand */}
      <div>
        <h1
          className="text-xl font-semibold px-2 text-Black cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          ExpenseTracker
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="bg-white text-black rounded-full font-medium text-sm h-10 px-4 hover:bg-gray-800 transition border border-white">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
