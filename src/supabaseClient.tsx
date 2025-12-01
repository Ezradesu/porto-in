import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables!");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
// supabase.auth.getSession().then(({ data, error }) => {
//   if (error) {
//     console.error("❌ Supabase connection test failed:", error);
//   } else {
//     console.log("✅ Supabase connection successful");
//   }
// });
