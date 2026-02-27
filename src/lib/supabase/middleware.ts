import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    const isDev = process.env.NODE_ENV === "development";
    const isMock = process.env.USE_MOCK === "true";

    // Dev/mock convenience: skip auth for local UI testing
    if (isMock || isDev) {
        return NextResponse.next({ request });
    }

    // Production: Supabase MUST be configured — fail closed
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "your-supabase-url-here") {
        console.error(
            "[mazraati] CRITICAL: Supabase env vars missing in production. " +
            "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
            "Redirecting all requests to /landing for safety."
        );
        // Avoid redirect loop on public routes
        const isLanding = request.nextUrl.pathname === "/landing" ||
            request.nextUrl.pathname.startsWith("/auth/");
        if (isLanding) return NextResponse.next({ request });

        const url = request.nextUrl.clone();
        url.pathname = "/landing";
        return NextResponse.redirect(url);
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/callback", "/landing"];
    const isPublicRoute = publicRoutes.some((route) =>
        request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/auth/")
    );

    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/landing";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
