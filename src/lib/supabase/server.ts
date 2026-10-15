import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Creates a Supabase client for server code (Server Components, Server Actions,
 * Route Handlers). The user's session lives in cookies, so the client reads and
 * writes cookies through Next.js.
 *
 * Create a new client for every request. Never share one between users.
 */
export async function createClient() {
  // Auth always depends on the current request, and the Supabase client checks
  // token expiry with the current time (Date.now()). connection() tells Next.js
  // to run this code at request time, never while prerendering or prefetching.
  await connection();
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Components cannot set cookies. That is fine here,
            // because the proxy (src/proxy.ts) refreshes the session cookies.
          }
        },
      },
    },
  );
}
