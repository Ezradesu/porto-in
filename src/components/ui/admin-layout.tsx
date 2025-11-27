"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./button";
import Link from "next/link";
import { supabase } from "@/supabaseClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [loading, session, router]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from("personal_info")
          .select("username")
          .eq("user_id", session.user.id)
          .single();

        if (data?.username) {
          setUsername(data.username);
        }
      }
    };

    fetchUsername();
  }, [session]);

  if (loading || !session) {
    return null; // Atau bisa tambahkan spinner loading di sini
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-auto min-h-16 max-w-7xl flex-wrap items-center justify-between px-4 py-2 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">Portfolio Setting</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href={username ? `/${username}` : "/"}>View Site</Link>
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
