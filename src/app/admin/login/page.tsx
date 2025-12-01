"use client";

import type React from "react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/ui/logo";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // TEMPORARY: Comment ini dulu untuk stop endless redirect
  /*
  useEffect(() => {
    if (session?.user && !isLoading) {
      console.log("✅ User sudah login, redirect ke /admin");
      const timer = setTimeout(() => {
        router.push("/admin");
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [session, router, isLoading]);
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        // Sederhana dulu, cuma satu strategi
        setTimeout(() => {
          router.push("/admin");
        }, 200);
      } else {
        console.error("❌ Login failed:", result.error);
        const errorMessage =
          result.error?.message || "Invalid username or password";
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login");
      setIsLoading(false);
    }
  };

  // TEMPORARY: Comment ini juga untuk debugging
  /*
  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Redirecting to dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  */

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Logo className="h-12 w-12 text-zinc-900" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-zinc-500">
                For demo purposes, use email: <strong>admin@example.com</strong>{" "}
                and password: <strong>admin123</strong>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-zinc-600">
              Dont have an account?{" "}
              <Link
                href="/admin/signup"
                className="font-medium text-zinc-900 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
