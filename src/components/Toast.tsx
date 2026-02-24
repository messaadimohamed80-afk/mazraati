"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";

/* ===== Types ===== */
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

/* ===== Context ===== */
const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

/* ===== Provider ===== */
export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev, { id, type, message, duration }]);
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

/* ===== Container ===== */
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;
    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
}

/* ===== Individual Toast ===== */
const TOAST_ICONS: Record<ToastType, string> = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (!toast.duration) return;
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, toast.duration);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div className={`toast toast-${toast.type} ${exiting ? "toast-exit" : ""}`}>
            <span className="toast-icon">{TOAST_ICONS[toast.type]}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-dismiss" onClick={handleDismiss} aria-label="إغلاق">
                ✕
            </button>
        </div>
    );
}
