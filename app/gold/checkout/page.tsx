

"use client";
// ...existing code...


import Link from "next/link";


export default function GoldCheckoutUnavailable() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-zinc-500">Gold checkout is currently unavailable.</div>
    </main>
  );
}
