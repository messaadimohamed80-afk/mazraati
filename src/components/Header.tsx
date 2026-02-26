"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import NotificationBell from "./header/NotificationBell";
import WeatherWidget from "./header/WeatherWidget";

// Lazy-load the heavy search palette (not needed until user opens it)
const SearchCommand = dynamic(() => import("./header/SearchCommand"), { ssr: false });

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "لوحة التحكم", subtitle: "نظرة عامة على المزرعة" },
    "/expenses": { title: "المحاسبة والمصاريف", subtitle: "تتبع وإدارة المصاريف" },
    "/water": { title: "إدارة المياه", subtitle: "الآبار والخزانات وشبكات الري" },
    "/energy": { title: "إدارة الطاقة", subtitle: "الطاقة الشمسية والكهرباء والمولدات" },
    "/crops": { title: "إدارة المحاصيل", subtitle: "المحاصيل والمواسم والإنتاج" },
    "/tasks": { title: "إدارة المهام", subtitle: "المهام والتذكيرات والفريق" },
    "/livestock": { title: "إدارة المواشي", subtitle: "القطيع والصحة والتغذية" },
    "/inventory": { title: "المخزون", subtitle: "المعدات والمواد والقطع" },
    "/reports": { title: "التقارير", subtitle: "تقارير وإحصائيات المزرعة" },
    "/settings": { title: "الإعدادات", subtitle: "إعدادات الحساب والمزرعة" },
};

export default function Header() {
    const pathname = usePathname();
    const page = PAGE_TITLES[pathname] || PAGE_TITLES["/"];
    const [searchOpen, setSearchOpen] = useState(false);
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        setFormattedDate(new Date().toLocaleDateString("ar-TN", {
            day: "numeric", month: "long", year: "numeric",
        }));
    }, []);

    // Keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "/" && !searchOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === "Escape") setSearchOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [searchOpen]);

    return (
        <>
            <header className="header">
                {/* Right side - page info */}
                <div className="header-right">
                    <button className="mobile-menu-btn" aria-label="القائمة">☰</button>
                    <div>
                        <h1 className="header-title">{page.title}</h1>
                        <p className="header-subtitle">
                            آخر تحديث: <span dir="ltr">{formattedDate}</span>
                        </p>
                    </div>
                </div>

                {/* Center - search trigger */}
                <div
                    className="header-search"
                    onClick={() => setSearchOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="البحث في المزرعة"
                >
                    <span className="header-search-icon">🔍</span>
                    <span className="header-search-placeholder">ابحث في المزرعة...</span>
                    <kbd className="header-search-kbd">/</kbd>
                </div>

                {/* Left side - actions */}
                <div className="header-left">
                    <NotificationBell />
                    <WeatherWidget />

                    {/* Exchange rate badge */}
                    <div className="header-badge" aria-label="سعر الصرف">
                        <span>💱</span>
                        <span dir="ltr">1 SAR = 0.83 TND</span>
                    </div>

                    {/* User avatar */}
                    <div className="header-avatar" aria-label="حسابي">
                        <span>م</span>
                    </div>
                </div>
            </header>

            {/* Search command palette (lazy loaded) */}
            <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
