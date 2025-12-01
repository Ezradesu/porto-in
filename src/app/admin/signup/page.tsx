"use client";

import { type FC, type FormEvent, useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { testSupabaseConnection, testSignupDirect } from "@/utils/supabaseTest";

const SignupPage: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { signUpNewUser } = useAuth();

  // Test koneksi saat component mount
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const directResult = await testSignupDirect(email.trim(), password);

      const result = await signUpNewUser(email.trim(), password, username.trim());

      if (result.success) {
        setSuccess(
          "Account created successfully! Please check your email to verify your account."
        );

        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        if (result.error) {
          console.error("❌ Signup error:", result.error);

          const errorMessage = result.error.message;

          if (
            errorMessage.includes("already registered") ||
            errorMessage.includes("already been registered")
          ) {
            setError(
              "Email already registered. Please use a different email or try to login."
            );
          } else if (
            errorMessage.includes("Password") &&
            errorMessage.includes("6 characters")
          ) {
            setError("Password must be at least 6 characters long");
          } else if (
            errorMessage.includes("Invalid email") ||
            errorMessage.includes("email")
          ) {
            setError("Please enter a valid email address");
          } else if (
            errorMessage.includes("disabled") ||
            errorMessage.includes("Signup")
          ) {
            setError("New user registration is currently disabled");
          } else if (errorMessage.includes("weak password")) {
            setError("Password is too weak. Please use a stronger password");
          } else {
            setError(errorMessage || "An error occurred during signup");
          }
        } else {
          setError("An unexpected error occurred during signup");
        }
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
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
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign up to create your portfolio admin account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
                minLength={3}
                disabled={isLoading}
              />
              <p className="text-xs text-zinc-500">
                Username will be saved to your profile after verification
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                minLength={6}
                disabled={isLoading}
              />
              <p className="text-xs text-zinc-500">
                Password must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-zinc-600">
              Already have an account?{" "}
              <Link
                href="/admin/login"
                className="font-medium text-zinc-900 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupPage;
