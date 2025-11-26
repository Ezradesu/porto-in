"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "../supabaseClient";
import { Session, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signUpNewUser: (
    email: string,
    password: string,
    username: string
  ) => Promise<{
    success: boolean;
    data?: any;
    error?: AuthError;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    data?: any;
    error?: AuthError;
  }>;
  signOut: () => Promise<void>;
}

// Buat context dengan default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signUpNewUser: async () => ({ success: false }),
  signIn: async () => ({ success: false }),
  signOut: async () => { },
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Cek session saat pertama kali load
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (mounted) {
          if (error) {
            console.error("Error getting session:", error);
          }
          setSession(session);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in getSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listener untuk perubahan auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUpNewUser = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      console.log("🚀 Attempting signup with:", {
        email,
        username,
        passwordLength: password.length,
      });

      // Pastikan supabase client tersedia
      if (!supabase) {
        console.error("❌ Supabase client not available");
        return {
          success: false,
          error: { message: "Supabase client not initialized" } as AuthError,
        };
      }

      console.log("🔄 Calling supabase.auth.signUp...");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      console.log("📊 Raw Supabase response:", { data, error });

      if (error) {
        console.error("❌ Signup error from Supabase:", error);
        return { success: false, error };
      }

      // Cek apakah data valid
      if (!data || !data.user) {
        console.error("❌ No data returned from Supabase");
        return {
          success: false,
          error: { message: "No response data from server" } as AuthError,
        };
      }

      // Create initial personal_info entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from("personal_info")
          .insert([
            {
              user_id: data.user.id,
              username: username,
              name: username, // Default name
              professional_title: "New User",
              short_description: "Welcome to my portfolio",
            },
          ]);

        if (profileError) {
          console.error("❌ Error creating profile:", profileError);
          // Don't fail the whole signup if profile creation fails, but log it
        } else {
          console.log("✅ Profile created successfully");
        }
      }

      console.log("✅ Signup successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("💥 Unexpected error during sign up:", error);
      return { success: false, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("🔄 AuthContext signIn called with:", {
      email,
      passwordLength: password.length,
    });

    try {
      // Pastikan supabase client tersedia
      if (!supabase) {
        console.error("❌ Supabase client not available");
        return {
          success: false,
          error: { message: "Supabase client not initialized" } as AuthError,
        };
      }

      console.log("🚀 Calling supabase.auth.signInWithPassword...");
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("📊 Raw Supabase signIn response:", response);

      const { data, error } = response;

      if (error) {
        console.error("❌ Supabase returned error:", error);
        return { success: false, error };
      }

      if (!data) {
        console.error("❌ No data in response");
        return {
          success: false,
          error: { message: "No data returned from server" } as AuthError,
        };
      }

      if (!data.user) {
        console.error("❌ No user in data:", data);
        return {
          success: false,
          error: { message: "No user data returned" } as AuthError,
        };
      }

      console.log("✅ SignIn successful! User:", data.user.email);
      console.log("✅ Session:", data.session ? "Present" : "Missing");

      return { success: true, data };
    } catch (error) {
      console.error("💥 Exception in signIn:", error);
      console.error("💥 Error type:", typeof error);
      console.error(
        "💥 Error stack:",
        error instanceof Error ? error.stack : "No stack"
      );

      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : String(error),
        } as AuthError,
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
    }
  };

  const value: AuthContextType = {
    session,
    loading,
    signUpNewUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
};
