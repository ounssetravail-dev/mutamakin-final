import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const { pathname } = url;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  const isAdminPage =
    pathname.startsWith("/admin") || pathname.startsWith("/Admin");

  const isProtectedContent =
    pathname.startsWith("/media") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/exercises") ||
    pathname.startsWith("/meetings");

  const isDashboard = pathname.startsWith("/dashboard");

  const isPublicPage = pathname === "/" || isAuthPage;

  if (!user && !isPublicPage) {
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (user && isDashboard) {
    return response;
  }

  if (user && isAdminPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile as { role: string } | null)?.role;

    if (role !== "admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  if (user && isProtectedContent) {
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id);

    const hasActiveSub =
      (subscriptions as { status: string }[] | null)?.some(
        (s) => s.status === "active"
      );

    if (!hasActiveSub) {
      url.pathname = "/subscribe";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};