"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [farmName, setFarmName] = useState("");
    const [currency, setCurrency] = useState("TND");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Account, 2: Farm
    const [success, setSuccess] = useState(false);

    const isMockMode = () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        return !url || url === "your-supabase-url-here";
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return;
        }
        if (password.length < 6) {
            setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }
        setStep(2);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (isMockMode()) {
                // Mock mode — simulate success
                await new Promise((r) => setTimeout(r, 500));
                router.push("/");
                return;
            }

            const result = await registerUser({
                email,
                password,
                fullName,
                farmName,
                currency,
            });

            if (!result.success) {
                setError(result.error || "حدث خطأ أثناء إنشاء الحساب");
                return;
            }

            if (result.needsConfirmation) {
                setSuccess(true);
                return;
            }

            // Registration successful, redirect to login
            router.push("/auth/login?registered=true");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
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
                    <p className="auth-logo-subtitle">أنشئ حسابك في ثوانٍ</p>
                </div>

                {success ? (
                    <div className="auth-card glass-card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
                        <h2 className="auth-card-title">تحقق من بريدك الإلكتروني</h2>
                        <p className="auth-card-subtitle" style={{ marginBottom: "1.5rem" }}>
                            أرسلنا رابط تأكيد إلى <strong dir="ltr">{email}</strong>
                            <br />
                            اضغط عليه لتفعيل حسابك
                        </p>
                        <Link href="/auth/login" className="auth-btn auth-btn-primary" style={{ display: "block", textDecoration: "none" }}>
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Step indicator */}
                        <div className="auth-steps">
                            <div className={`auth-step ${step >= 1 ? "auth-step-active" : ""}`}>
                                <span className="auth-step-number">1</span>
                                <span className="auth-step-label">الحساب</span>
                            </div>
                            <div className="auth-step-line" />
                            <div className={`auth-step ${step >= 2 ? "auth-step-active" : ""}`}>
                                <span className="auth-step-number">2</span>
                                <span className="auth-step-label">المزرعة</span>
                            </div>
                        </div>

                        {/* Card */}
                        <div className="auth-card glass-card">
                            {error && (
                                <div className="auth-error">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {step === 1 ? (
                                <>
                                    <h2 className="auth-card-title">معلومات الحساب</h2>
                                    <form onSubmit={handleNext} className="auth-form">
                                        <div className="auth-field">
                                            <label htmlFor="fullName" className="auth-label">
                                                الاسم الكامل
                                            </label>
                                            <input
                                                id="fullName"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="محمد أحمد"
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <div className="auth-field">
                                            <label htmlFor="reg-email" className="auth-label">
                                                البريد الإلكتروني
                                            </label>
                                            <input
                                                id="reg-email"
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
                                            <label htmlFor="reg-password" className="auth-label">
                                                كلمة المرور
                                            </label>
                                            <input
                                                id="reg-password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="6 أحرف على الأقل"
                                                className="auth-input"
                                                required
                                                dir="ltr"
                                                minLength={6}
                                            />
                                        </div>

                                        <div className="auth-field">
                                            <label htmlFor="confirm-password" className="auth-label">
                                                تأكيد كلمة المرور
                                            </label>
                                            <input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="أعد كتابة كلمة المرور"
                                                className="auth-input"
                                                required
                                                dir="ltr"
                                                minLength={6}
                                            />
                                        </div>

                                        <button type="submit" className="auth-btn auth-btn-primary">
                                            التالي — معلومات المزرعة
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 className="auth-card-title">معلومات المزرعة</h2>
                                    <p className="auth-card-subtitle">
                                        أخبرنا عن مزرعتك لتخصيص تجربتك
                                    </p>
                                    <form onSubmit={handleRegister} className="auth-form">
                                        <div className="auth-field">
                                            <label htmlFor="farmName" className="auth-label">
                                                اسم المزرعة
                                            </label>
                                            <input
                                                id="farmName"
                                                type="text"
                                                value={farmName}
                                                onChange={(e) => setFarmName(e.target.value)}
                                                placeholder="مزرعة الواحة"
                                                className="auth-input"
                                                required
                                            />
                                        </div>

                                        <div className="auth-field">
                                            <label htmlFor="currency" className="auth-label">
                                                العملة الأساسية
                                            </label>
                                            <select
                                                id="currency"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                                className="auth-input auth-select"
                                            >
                                                <option value="TND">🇹🇳 دينار تونسي (د.ت)</option>
                                                <option value="DZD">🇩🇿 دينار جزائري (د.ج)</option>
                                                <option value="SAR">🇸🇦 ريال سعودي (ر.س)</option>
                                                <option value="EGP">🇪🇬 جنيه مصري (ج.م)</option>
                                                <option value="MAD">🇲🇦 درهم مغربي (د.م)</option>
                                                <option value="USD">🇺🇸 دولار أمريكي ($)</option>
                                            </select>
                                        </div>

                                        <div className="auth-buttons-row">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="auth-btn auth-btn-secondary"
                                            >
                                                السابق
                                            </button>
                                            <button
                                                type="submit"
                                                className="auth-btn auth-btn-primary"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="auth-spinner" />
                                                ) : (
                                                    "🚀 إنشاء الحساب"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Bottom link */}
                        <p className="auth-footer-text">
                            لديك حساب بالفعل؟{" "}
                            <Link href="/auth/login" className="auth-link">
                                تسجيل الدخول
                            </Link>
                        </p>

                        <Link href="/" className="auth-back-link">
                            ← العودة للوحة التحكم
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
