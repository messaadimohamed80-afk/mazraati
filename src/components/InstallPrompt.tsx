"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Don't show if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        // Don't show if user has dismissed before
        if (localStorage.getItem("mazraati_install_dismissed")) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = useCallback(async () => {
        if (!deferredPrompt) return;
        setIsInstalling(true);

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setShowBanner(false);
            }
        } catch {
            // Prompt failed — silently ignore
        } finally {
            setIsInstalling(false);
            setDeferredPrompt(null);
        }
    }, [deferredPrompt]);

    const handleDismiss = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setShowBanner(false);
            localStorage.setItem("mazraati_install_dismissed", "true");
        }, 300);
    }, []);

    if (!showBanner) return null;

    return (
        <div className={`install-prompt ${isClosing ? "install-prompt-closing" : ""}`}>
            <div className="install-prompt-content">
                <div className="install-prompt-icon">📲</div>
                <div className="install-prompt-text">
                    <strong>تثبيت مزرعتي</strong>
                    <p>أضف التطبيق لشاشتك الرئيسية للوصول السريع</p>
                </div>
            </div>
            <div className="install-prompt-actions">
                <button
                    className="install-prompt-btn install-prompt-btn-install"
                    onClick={handleInstall}
                    disabled={isInstalling}
                >
                    {isInstalling ? (
                        <span className="install-prompt-spinner" />
                    ) : (
                        "تثبيت"
                    )}
                </button>
                <button
                    className="install-prompt-btn install-prompt-btn-dismiss"
                    onClick={handleDismiss}
                >
                    لاحقًا
                </button>
            </div>
        </div>
    );
}
