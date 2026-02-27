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
