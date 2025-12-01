"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCombobox } from "@/components/ui/combobox";


export default function LandingPage() {

  return (
    <main className="relative min-h-screen w-full text-zinc-900 flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/layer-3.svg"
            alt="Logo"
            width={50}
            height={50}
            className="h-12 w-12"
          />
          {/* <span className="font-bold text-xl"></span> */}
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Showcase Your Work <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Like a Pro
          </span>
        </h1>
        <p className="text-xl text-zinc-600 mb-12 max-w-2xl">
          Create a stunning portfolio in minutes. Join our community of creators and share your journey with the world.
        </p>

        {/* Search User */}
        <div className="w-full max-w-md space-y-4">
          <UserCombobox />
          <p className="text-sm text-zinc-500">
            Try searching for your friend&apos;s username to see their portfolio.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} PortoIn. All rights reserved.</p>
      </footer>
    </main>
  );
}
