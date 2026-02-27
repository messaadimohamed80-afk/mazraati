import { describe, it, expect } from "vitest";
import { ok, err, type ActionResult } from "@/lib/action-result";

describe("ActionResult helpers", () => {
    it("ok() creates success result", () => {
        const result = ok({ id: "123", name: "test" });
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.id).toBe("123");
            expect(result.data.name).toBe("test");
        }
    });

    it("err() creates failure result", () => {
        const result = err("Something went wrong", "DB_ERROR");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.message).toBe("Something went wrong");
            expect(result.error.code).toBe("DB_ERROR");
        }
    });

    it("err() defaults to UNKNOWN code", () => {
        const result = err("generic error");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("UNKNOWN");
        }
    });

    it("discriminated union narrows correctly", () => {
        function simulate(shouldFail: boolean): ActionResult<string> {
            if (shouldFail) return err("failed", "NOT_FOUND");
            return ok("success");
        }

        const success = simulate(false);
        if (success.ok) {
            // TypeScript should narrow this to { ok: true; data: string }
            expect(success.data).toBe("success");
        }

        const failure = simulate(true);
        if (!failure.ok) {
            // TypeScript should narrow this to { ok: false; error: ActionError }
            expect(failure.error.code).toBe("NOT_FOUND");
        }
    });
});
