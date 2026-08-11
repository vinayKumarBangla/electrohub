import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 🛠️ SET THIS TO TRUE FOR LOCAL TESTING SO YOU CAN ACCESS /admin FREELY
const ALLOW_ADMIN_BYPASS = true;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth session
  const { data: { user } } = await supabase.auth.getUser();

  // Admin Route Protection Check
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin")) {
    // If bypass mode is off, enforce strict authentication/role rules
    if (!ALLOW_ADMIN_BYPASS) {
      const userRole = user?.user_metadata?.role;
      if (!user || userRole !== 'admin') {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};