"use client";

import { useState, useEffect, useCallback } from "react";

const ONBOARDING_KEY = "mazraati_onboarded";

interface OnboardingStep {
    icon: string;
    title: string;
    description: string;
    features?: string[];
}

const steps: OnboardingStep[] = [
    {
        icon: "🌾",
        title: "مرحبًا بك في مزرعتي!",
        description:
            "منصتك الذكية لإدارة كل تفاصيل مزرعتك — من المصاريف والمحاصيل إلى المواشي والآبار، كلها في مكان واحد.",
        features: [
            "📊 لوحة تحكم شاملة",
            "📱 يعمل على الهاتف والكمبيوتر",
            "🔒 بياناتك آمنة ومحمية",
        ],
    },
    {
        icon: "🗂️",
        title: "وحدات المزرعة",
        description: "تحكم في كل جوانب مزرعتك من خلال وحدات متخصصة:",
        features: [
            "💰 المحاسبة — تتبع المصاريف والإيرادات",
            "🌾 المحاصيل — إدارة الزراعة والحصاد",
            "🐑 المواشي — متابعة القطيع والتطعيمات",
            "💧 الآبار — مراقبة مستوى المياه",
            "⚡ الطاقة — تتبع استهلاك الكهرباء والوقود",
            "📦 المخزون — إدارة المعدات والمواد",
        ],
    },
    {
        icon: "🚀",
        title: "ابدأ الآن!",
        description:
            "مزرعتك جاهزة! يمكنك البدء بإضافة أول مصروف أو تسجيل محصول جديد. كل البيانات تُحفظ تلقائيًا.",
        features: [
            "✅ أضف أول مصروف من صفحة المحاسبة",
            "✅ سجّل محاصيلك من صفحة المحاصيل",
            "✅ تابع تقاريرك من صفحة التقارير",
        ],
    },
];

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Show only if user hasn't completed onboarding
        if (!localStorage.getItem(ONBOARDING_KEY)) {
            // Small delay so the dashboard loads first
            const timer = setTimeout(() => setIsOpen(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            localStorage.setItem(ONBOARDING_KEY, "true");
        }, 300);
    }, []);

    const handleNext = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleClose();
        }
    }, [currentStep, handleClose]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    if (!isOpen) return null;

    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    const isFirst = currentStep === 0;

    return (
        <div
            className={`onboarding-overlay ${isClosing ? "onboarding-overlay-closing" : ""}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="مرحبًا بك في مزرعتي"
        >
            <div
                className={`onboarding-modal glass-card ${isClosing ? "onboarding-modal-closing" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Progress dots */}
                <div className="onboarding-progress">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`onboarding-dot ${i === currentStep ? "onboarding-dot-active" : ""} ${i < currentStep ? "onboarding-dot-done" : ""}`}
                        />
                    ))}
                </div>

                {/* Step content */}
                <div className="onboarding-step" key={currentStep}>
                    <div className="onboarding-icon">{step.icon}</div>
                    <h2 className="onboarding-title">{step.title}</h2>
                    <p className="onboarding-desc">{step.description}</p>

                    {step.features && (
                        <ul className="onboarding-features">
                            {step.features.map((feature, i) => (
                                <li
                                    key={i}
                                    className="onboarding-feature"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Navigation */}
                <div className="onboarding-nav">
                    {!isFirst ? (
                        <button
                            className="onboarding-btn onboarding-btn-back"
                            onClick={handleBack}
                        >
                            → السابق
                        </button>
                    ) : (
                        <button
                            className="onboarding-btn onboarding-btn-skip"
                            onClick={handleClose}
                        >
                            تخطي
                        </button>
                    )}

                    <button
                        className="onboarding-btn onboarding-btn-next"
                        onClick={handleNext}
                    >
                        {isLast ? "ابدأ الآن! 🚀" : "التالي ←"}
                    </button>
                </div>

                {/* Close button */}
                <button className="onboarding-close" onClick={handleClose}>
                    ✕
                </button>
            </div>
        </div>
    );
}
