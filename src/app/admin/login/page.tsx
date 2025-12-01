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
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:top-8 md:left-8"
        onClick={handleBack}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/Layer-3.svg"
              alt="logo"
              className="h-32 w-32 text-zinc-900 hover:scale-110 hover:rotate-6 transition-all duration-150 ease-in-out"
              height={100}
              width={100}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
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
