"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return null; // Atau bisa tambahkan spinner loading di sini
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">Portfolio Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">View Site</Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
    </div>
  );
}
