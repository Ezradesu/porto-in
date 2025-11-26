// File: src/utils/supabaseTest.ts
// Gunakan ini untuk test koneksi Supabase

import { supabase } from "@/supabaseClient";

export const testSupabaseConnection = async () => {
  console.log("🧪 Testing Supabase connection...");

  // Test 1: Cek apakah client ter-initialize
  console.log("1️⃣ Supabase client:", supabase);
  console.log("2️⃣ Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "3️⃣ Supabase Anon Key exists:",
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // Test 2: Simple auth test
    const { data, error } = await supabase.auth.getSession();
    console.log("4️⃣ Auth test result:", { data, error });

    // Test 3: Try to get auth user (should be null for non-authenticated)
    const { data: userData, error: userError } = await supabase.auth.getUser();
    console.log("5️⃣ User test result:", { userData, userError });

    return true;
  } catch (error) {
    console.error("❌ Supabase connection test failed:", error);
    return false;
  }
};

// Tambahkan ini ke signup page untuk test
export const testSignupDirect = async (email: string, password: string) => {
  console.log("🧪 Direct signup test...");

  try {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("📊 Direct signup result:", result);
    return result;
  } catch (error) {
    console.error("💥 Direct signup error:", error);
    return { data: null, error };
  }
};
