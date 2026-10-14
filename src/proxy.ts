import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js runs the proxy before each matching request (it used to be called "middleware").
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all pages, but skip static files and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
