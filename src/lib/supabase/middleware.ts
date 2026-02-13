import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    // If mock mode, pass through all requests (no auth required)
    if (process.env.USE_MOCK === "true") {
        return NextResponse.next({ request });
    }

    // If Supabase is not configured yet, pass through all requests
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "your-supabase-url-here") {
        return NextResponse.next({ request });
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
    const publicRoutes = ["/auth/login", "/auth/register", "/auth/callback", "/", "/landing"];
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
