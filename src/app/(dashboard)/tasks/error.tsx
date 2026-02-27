"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            padding: "2rem",
            textAlign: "center"
        }}>
            <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
            }}>⚠️</div>
            <h2 style={{
                fontSize: "1.5rem",
                color: "var(--text-primary)",
                marginBottom: "0.5rem"
            }}>
                عذراً، حدث خطأ ما!
            </h2>
            <p style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                maxWidth: "400px"
            }}>
                {error.message || "حدث خطأ غير متوقع أثناء جلب البيانات. يرجى المحاولة مرة أخرى."}
            </p>
            <button
                onClick={() => reset()}
                className="modal-btn modal-btn-save"
                style={{ padding: "0.75rem 2rem" }}
            >
                🔄 المحاولة مرة أخرى
            </button>
        </div>
    );
}
