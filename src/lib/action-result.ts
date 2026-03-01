/**
 * Standardized action result type for all server actions.
 * 
 * Usage:
 *   return ok(data)   — success
 *   return err("...")  — failure with message
 *   return err("...", "NOT_FOUND") — failure with code
 */

export type ActionError = {
    message: string;
    code?: "NOT_FOUND" | "NOT_AUTHENTICATED" | "VALIDATION_ERROR" | "DB_ERROR" | "UNKNOWN";
};

export type ActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ActionError };

/** Create a success result */
export function ok<T>(data: T): ActionResult<T> {
    return { ok: true, data };
}

/** Create an error result */
export function err<T = never>(
    message: string,
    code: ActionError["code"] = "UNKNOWN"
): ActionResult<T> {
    return { ok: false, error: { message, code } };
}

/** Create a success result for void actions (delete, etc.) */
export function okVoid(): ActionResult<void> {
    return { ok: true, data: undefined as unknown as void };
}

/** Unwrap an ActionResult — returns data on success, throws on error.
 *  Designed for React Query queryFn where thrown errors become query errors. */
export async function unwrap<T>(fn: () => Promise<ActionResult<T>>): Promise<T> {
    const res = await fn();
    if (!res.ok) throw new Error(res.error.message);
    return res.data;
}
