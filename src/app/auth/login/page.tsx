"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const isMockMode = () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        return !url || url === "your-supabase-url-here";
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (isMockMode()) {
                // Mock mode — skip auth, go straight to dashboard
                await new Promise((r) => setTimeout(r, 500));
                router.push("/");
                return;
            }

            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError) throw authError;
            router.push("/");
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (isMockMode()) {
            setError("يرجى إعداد Supabase أولاً — Google OAuth يتطلب اتصال Supabase");
            return;
        }

        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (authError) throw authError;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        }
    };

    return (
        <div className="auth-page">
            {/* Background decoration */}
            <div className="auth-bg">
                <div className="auth-bg-circle auth-bg-circle-1" />
                <div className="auth-bg-circle auth-bg-circle-2" />
                <div className="auth-bg-circle auth-bg-circle-3" />
            </div>

            <div className="auth-container">
                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo-icon">🌾</span>
                    <h1 className="auth-logo-text">مزرعتي</h1>
                    <p className="auth-logo-subtitle">منصة إدارة المزارع الذكية</p>
                </div>

                {/* Card */}
                <div className="auth-card glass-card">
                    <h2 className="auth-card-title">تسجيل الدخول</h2>
                    <p className="auth-card-subtitle">
                        أدخل بياناتك للوصول إلى لوحة التحكم
                    </p>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-field">
                            <label htmlFor="email" className="auth-label">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="farmer@mazraati.com"
                                className="auth-input"
                                required
                                dir="ltr"
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-label-row">
                                <label htmlFor="password" className="auth-label">
                                    كلمة المرور
                                </label>
                                <Link href="/auth/forgot" className="auth-link-small">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="auth-input"
                                required
                                dir="ltr"
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-btn auth-btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="auth-spinner" />
                            ) : (
                                "تسجيل الدخول"
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>أو</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="auth-btn auth-btn-google"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span>الدخول بحساب Google</span>
                    </button>

                    <button className="auth-btn auth-btn-phone">
                        <span>📱</span>
                        <span>الدخول برقم الهاتف</span>
                    </button>
                </div>

                {/* Bottom link */}
                <p className="auth-footer-text">
                    ليس لديك حساب؟{" "}
                    <Link href="/auth/register" className="auth-link">
                        إنشاء حساب جديد
                    </Link>
                </p>

                {/* Back to dashboard */}
                <Link href="/" className="auth-back-link">
                    ← العودة للوحة التحكم
                </Link>
            </div>
        </div>
    );
}
