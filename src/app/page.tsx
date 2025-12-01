"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCombobox } from "@/components/ui/combobox";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/ui/aurora-text";


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
        <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 mb-6 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
          <AnimatedGradientText className="text-sm font-medium">
            Create portfolio in minutes
          </AnimatedGradientText>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Showcase Your Work <br />
          <AuroraText>Like a Pro</AuroraText>
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
