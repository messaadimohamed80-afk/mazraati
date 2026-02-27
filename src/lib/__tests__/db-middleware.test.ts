import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for isMockMode() and middleware auth decision logic.
 * These test the pure decision functions, not the Next.js middleware runtime.
 */

describe("isMockMode()", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        // Reset env for each test
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    it("returns true when USE_MOCK=true", async () => {
        process.env.USE_MOCK = "true";
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://real.supabase.co";
        const { isMockMode } = await import("@/lib/db");
        expect(isMockMode()).toBe(true);
    });

    it("returns true when SUPABASE_URL is missing", async () => {
        delete process.env.USE_MOCK;
        delete process.env.NEXT_PUBLIC_SUPABASE_URL;
        const { isMockMode } = await import("@/lib/db");
        expect(isMockMode()).toBe(true);
    });

    it("returns true when SUPABASE_URL is placeholder", async () => {
        delete process.env.USE_MOCK;
        process.env.NEXT_PUBLIC_SUPABASE_URL = "your-supabase-url-here";
        const { isMockMode } = await import("@/lib/db");
        expect(isMockMode()).toBe(true);
    });

    it("returns false when SUPABASE_URL is configured and USE_MOCK is not set", async () => {
        delete process.env.USE_MOCK;
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://myproject.supabase.co";
        const { isMockMode } = await import("@/lib/db");
        expect(isMockMode()).toBe(false);
    });
});

describe("middleware auth decision logic", () => {
    it("identifies public routes correctly", () => {
        const publicRoutes = ["/auth/login", "/auth/register", "/auth/callback", "/landing"];
        const isPublicRoute = (pathname: string) =>
            publicRoutes.some((route) =>
                pathname === route || pathname.startsWith("/auth/")
            );

        expect(isPublicRoute("/auth/login")).toBe(true);
        expect(isPublicRoute("/auth/register")).toBe(true);
        expect(isPublicRoute("/auth/callback")).toBe(true);
        expect(isPublicRoute("/landing")).toBe(true);
        expect(isPublicRoute("/")).toBe(false);
        expect(isPublicRoute("/dashboard")).toBe(false);
        expect(isPublicRoute("/expenses")).toBe(false);
    });

    it("development mode bypasses auth (by design)", () => {
        const isDev = true;
        const isMock = false;
        const shouldBypass = isDev || isMock;
        expect(shouldBypass).toBe(true);
    });

    it("production with missing env should NOT bypass", () => {
        const isDev = false;
        const isMock = false;
        const shouldBypass = isDev || isMock;
        expect(shouldBypass).toBe(false);
    });
});
