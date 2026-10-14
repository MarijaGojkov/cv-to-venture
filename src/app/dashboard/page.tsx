import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

// The page shell is static. Only the part that reads the session (cookies)
// runs per request, inside <Suspense>, so the shell can be shown right away.
export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p className="text-gray-600">Loading…</p>}>
        <CurrentUser />
      </Suspense>
      <p className="text-gray-600">CV upload and business ideas are coming next.</p>
      <form action={logout}>
        <button className="rounded border px-4 py-2">Log out</button>
      </form>
    </main>
  );
}

// Protected content: the proxy already redirects logged-out users,
// and we check again here so it never renders without a user.
async function CurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <p>
      You are logged in as <strong>{data.claims.email}</strong>.
    </p>
  );
}
