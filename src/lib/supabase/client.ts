import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
