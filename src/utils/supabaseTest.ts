// File: src/utils/supabaseTest.ts
// Gunakan ini untuk test koneksi Supabase

import { supabase } from "@/supabaseClient";

export const testSupabaseConnection = async () => {
  try {
    // Test 2: Simple auth test
    await supabase.auth.getSession();

    // Test 3: Try to get auth user (should be null for non-authenticated)
    await supabase.auth.getUser();

    return true;
  } catch (error) {
    console.error("❌ Supabase connection test failed:", error);
    return false;
  }
};

// Tambahkan ini ke signup page untuk test
export const testSignupDirect = async (email: string, password: string) => {
  try {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    return result;
  } catch (error) {
    console.error("💥 Direct signup error:", error);
    return { data: null, error };
  }
};
