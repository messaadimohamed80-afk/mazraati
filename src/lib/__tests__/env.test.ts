import { describe, it, expect, vi, afterEach } from "vitest";
import { requireEnv, getSupabaseEnv, getServiceRoleKey } from "@/lib/env";

describe("requireEnv", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returns the value when env var is set", () => {
        vi.stubEnv("TEST_VAR", "hello");
        expect(requireEnv("TEST_VAR")).toBe("hello");
    });

    it("throws descriptive error when env var is missing", () => {
        vi.stubEnv("TEST_MISSING", "");
        expect(() => requireEnv("TEST_MISSING")).toThrow("Missing required environment variable: TEST_MISSING");
    });

    it("throws when env var is undefined", () => {
        delete process.env.TOTALLY_ABSENT;
        expect(() => requireEnv("TOTALLY_ABSENT")).toThrow("Missing required environment variable: TOTALLY_ABSENT");
    });
});

describe("getSupabaseEnv", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returns url and anonKey when both are set", () => {
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-123");

        const env = getSupabaseEnv();
        expect(env.url).toBe("https://x.supabase.co");
        expect(env.anonKey).toBe("anon-key-123");
    });

    it("throws when SUPABASE_URL is missing", () => {
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
        vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "key");
        expect(() => getSupabaseEnv()).toThrow("NEXT_PUBLIC_SUPABASE_URL");
    });
});

describe("getServiceRoleKey", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returns service role key when set", () => {
        vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "srv-key");
        expect(getServiceRoleKey()).toBe("srv-key");
    });

    it("throws when service role key is missing", () => {
        vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
        expect(() => getServiceRoleKey()).toThrow("SUPABASE_SERVICE_ROLE_KEY");
    });
});
