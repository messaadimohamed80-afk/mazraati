"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
    { href: "/", label: "لوحة التحكم", icon: "📊", id: "dashboard" },
    { href: "/expenses", label: "المصاريف", icon: "💰", id: "expenses" },
    { href: "/water", label: "المياه", icon: "💧", id: "water" },
    { href: "/energy", label: "الطاقة", icon: "⚡", id: "energy" },
    { href: "/crops", label: "المحاصيل", icon: "🌾", id: "crops" },
    { href: "/livestock", label: "المواشي", icon: "🐑", id: "livestock" },
    { href: "/inventory", label: "المخزون", icon: "📦", id: "inventory" },
    { href: "/tasks", label: "المهام", icon: "✅", id: "tasks" },
    { href: "/reports", label: "التقارير", icon: "📄", id: "reports" },
];

const bottomItems = [
    { href: "/settings", label: "الإعدادات", icon: "⚙️", id: "settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Persist collapsed state to localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved === "true") setCollapsed(true);
    }, []);

    const toggleCollapsed = () => {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("sidebar-collapsed", String(next));
    };

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay ${collapsed ? "" : "hidden"}`}
                onClick={() => setCollapsed(false)}
            />

            <aside
                className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}
                data-collapsed={collapsed}
            >
                {/* Logo */}
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon">🌾</span>
                    <span className="sidebar-logo-text">مزرعتي</span>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                prefetch={false}
                                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                                title={item.label}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                <span className="sidebar-link-text">{item.label}</span>

                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="sidebar-bottom">
                    {bottomItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                prefetch={false}
                                className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                                title={item.label}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                <span className="sidebar-link-text">{item.label}</span>

                            </Link>
                        );
                    })}

                    {/* Theme toggle */}
                    <ThemeToggle collapsed={collapsed} />

                    {/* Collapse toggle */}
                    <button
                        onClick={toggleCollapsed}
                        className="sidebar-toggle"
                        aria-label="Toggle sidebar"
                    >
                        <span>{collapsed ? "◀" : "▶"}</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
    const { theme, toggle } = useTheme();
    return (
        <button className="theme-toggle" onClick={toggle}>
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
            {!collapsed && <span>{theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}</span>}
        </button>
    );
}
