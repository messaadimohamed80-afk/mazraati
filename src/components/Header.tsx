"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Expense, Category, Crop, Task, Animal, VaccinationRecord, FeedRecord, InventoryItem } from "@/lib/types";
import { isOverdue } from "@/lib/mock-crops-tasks-data";
import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals, getVaccinations, getFeedRecords } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";

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

function getFormattedDate(): string {
    return new Date().toLocaleDateString("ar-TN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/* ===== Build searchable items ===== */
interface SearchItem {
    type: "expense" | "crop" | "task" | "animal" | "inventory";
    icon: string;
    label: string;
    sub: string;
    href: string;
}

function buildSearchIndex(
    expenses: Expense[],
    categories: Category[],
    crops: Crop[],
    tasks: Task[],
    animals: Animal[],
    inventory: InventoryItem[],
): SearchItem[] {
    const items: SearchItem[] = [];
    expenses.forEach((e) => {
        const cat = categories.find((c) => c.id === e.category_id);
        items.push({ type: "expense", icon: "💰", label: e.description, sub: cat?.name || "", href: "/expenses" });
    });
    crops.forEach((c) => {
        items.push({ type: "crop", icon: "🌾", label: `${c.crop_type} — ${c.variety || ""}`, sub: c.field_name || "", href: `/crops/${c.id}` });
    });
    tasks.forEach((t) => {
        items.push({ type: "task", icon: "✅", label: t.title, sub: t.assigned_to || "", href: "/tasks" });
    });
    animals.forEach((a) => {
        items.push({ type: "animal", icon: "🐑", label: `${a.tag_number} — ${a.name}`, sub: a.breed, href: "/livestock" });
    });
    inventory.forEach((i) => {
        items.push({ type: "inventory", icon: "📦", label: i.name, sub: i.location, href: "/inventory" });
    });
    return items;
}

/* ===== Build notifications ===== */
interface NotifItem {
    id: string;
    icon: string;
    text: string;
    color: string;
    href: string;
}

function buildNotifications(
    tasks: Task[],
    vaccinations: VaccinationRecord[],
    feed: FeedRecord[],
    inventory: InventoryItem[],
    animals: Animal[],
): NotifItem[] {
    const notifs: NotifItem[] = [];
    // Overdue tasks
    const overdueTasks = tasks.filter((t) => t.status !== "done" && isOverdue(t.due_date));
    if (overdueTasks.length > 0) {
        notifs.push({ id: "overdue-tasks", icon: "⚠️", text: `${overdueTasks.length} مهام متأخرة`, color: "#ef4444", href: "/tasks" });
    }
    // Overdue vaccinations
    const overdueVax = vaccinations.filter((v) => v.next_due && new Date(v.next_due) < new Date());
    if (overdueVax.length > 0) {
        notifs.push({ id: "overdue-vax", icon: "💉", text: `${overdueVax.length} تطعيم متأخر`, color: "#f59e0b", href: "/livestock" });
    }
    // Low feed
    const lowFeed = feed.filter((f) => f.remaining_kg / f.quantity_kg < 0.3);
    if (lowFeed.length > 0) {
        notifs.push({ id: "low-feed", icon: "🌾", text: `${lowFeed.length} أعلاف مخزون منخفض`, color: "#f97316", href: "/livestock" });
    }
    // Low inventory
    const lowInv = inventory.filter((i) => i.quantity <= i.min_stock);
    if (lowInv.length > 0) {
        notifs.push({ id: "low-inv", icon: "📦", text: `${lowInv.length} مخزون منخفض`, color: "#ec4899", href: "/inventory" });
    }
    // Sick animals
    const sickAnimals = animals.filter((a) => a.status === "sick");
    if (sickAnimals.length > 0) {
        notifs.push({ id: "sick", icon: "🤒", text: `${sickAnimals.length} حيوان مريض`, color: "#ef4444", href: "/livestock" });
    }
    return notifs;
}

/* ===== Dynamic weather (seasonal for Tunisia) ===== */
function getWeather(): { temp: number; icon: string; desc: string; humidity: number } {
    const month = new Date().getMonth();
    const temps: Record<number, [number, number]> = {
        0: [8, 15], 1: [9, 16], 2: [11, 19], 3: [14, 22], 4: [17, 26],
        5: [21, 31], 6: [24, 34], 7: [25, 35], 8: [22, 31], 9: [18, 26],
        10: [13, 21], 11: [9, 16],
    };
    const [lo, hi] = temps[month] || [15, 25];
    const hour = new Date().getHours();
    const t = hour < 6 ? lo : hour < 14 ? Math.round(lo + (hi - lo) * (hour - 6) / 8) : Math.round(hi - (hi - lo) * (hour - 14) / 10);
    const icons: Record<number, string> = { 0: "❄️", 1: "🌧️", 2: "🌤️", 3: "☀️", 4: "☀️", 5: "☀️", 6: "☀️", 7: "☀️", 8: "🌤️", 9: "🌤️", 10: "🌧️", 11: "❄️" };
    const descs: Record<number, string> = { 0: "بارد", 1: "ممطر", 2: "معتدل", 3: "مشمس", 4: "مشمس", 5: "حار", 6: "حار جداً", 7: "حار جداً", 8: "معتدل", 9: "معتدل", 10: "ممطر", 11: "بارد" };
    const day = new Date().getDate();
    const humidity = month >= 5 && month <= 8 ? 35 + (day % 11) : 55 + (day % 21);
    return { temp: t, icon: icons[month] || "☀️", desc: descs[month] || "معتدل", humidity };
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const page = PAGE_TITLES[pathname] || PAGE_TITLES["/"];

    /* Fetched data for search + notifications */
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [crops, setCrops] = useState<Crop[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
    const [feed, setFeed] = useState<FeedRecord[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        Promise.all([
            getExpenses().then(setExpenses).catch(() => { }),
            getCategories().then(setCategories).catch(() => { }),
            getCrops().then(setCrops).catch(() => { }),
            getTasks().then(setTasks).catch(() => { }),
            getAnimals().then(setAnimals).catch(() => { }),
            getVaccinations().then(setVaccinations).catch(() => { }),
            getFeedRecords().then(setFeed).catch(() => { }),
            getInventory().then(setInventory).catch(() => { }),
        ]);
    }, []);

    /* Search */
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);
    const allItems = useMemo(() => buildSearchIndex(expenses, categories, crops, tasks, animals, inventory), [expenses, categories, crops, tasks, animals, inventory]);
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return allItems.filter((item) =>
            item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [searchQuery, allItems]);

    /* Notifications */
    const [notifOpen, setNotifOpen] = useState(false);
    const notifications = useMemo(() => buildNotifications(tasks, vaccinations, feed, inventory, animals), [tasks, vaccinations, feed, inventory, animals]);

    /* Weather */
    const weather = useMemo(() => getWeather(), []);

    /* Keyboard shortcut */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "/" && !searchOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                setSearchOpen(true);
            }
            if (e.key === "Escape") {
                setSearchOpen(false);
                setNotifOpen(false);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [searchOpen]);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    return (
        <>
            <header className="header">
                {/* Right side - page info */}
                <div className="header-right">
                    <button className="mobile-menu-btn" aria-label="القائمة">
                        ☰
                    </button>
                    <div>
                        <h1 className="header-title">{page.title}</h1>
                        <p className="header-subtitle">
                            آخر تحديث: <span dir="ltr">{getFormattedDate()}</span>
                        </p>
                    </div>
                </div>

                {/* Center - search trigger */}
                <div className="header-search" onClick={() => setSearchOpen(true)} role="button" tabIndex={0}>
                    <span className="header-search-icon">🔍</span>
                    <span className="header-search-placeholder">ابحث في المزرعة...</span>
                    <kbd className="header-search-kbd">/</kbd>
                </div>

                {/* Left side - actions */}
                <div className="header-left">
                    {/* Notification bell */}
                    <div className="header-notif-wrapper">
                        <button
                            className="header-icon-btn"
                            title="الإشعارات"
                            onClick={() => { setNotifOpen(!notifOpen); setSearchOpen(false); }}
                        >
                            <span>🔔</span>
                            {notifications.length > 0 && (
                                <span className="header-notif-dot">{notifications.length}</span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="header-notif-dropdown">
                                <div className="header-notif-title">🔔 التنبيهات</div>
                                {notifications.length === 0 ? (
                                    <div className="header-notif-empty">لا توجد تنبيهات</div>
                                ) : (
                                    notifications.map((n) => (
                                        <button
                                            key={n.id}
                                            className="header-notif-item"
                                            onClick={() => { router.push(n.href); setNotifOpen(false); }}
                                        >
                                            <span className="header-notif-item-icon" style={{ color: n.color }}>{n.icon}</span>
                                            <span className="header-notif-item-text">{n.text}</span>
                                            <span className="header-notif-item-arrow">←</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Weather */}
                    <div className="header-badge" title={`${weather.desc} — رطوبة ${weather.humidity}%`}>
                        <span>{weather.icon}</span>
                        <span>{weather.temp}°C</span>
                    </div>

                    {/* Exchange rate badge */}
                    <div className="header-badge">
                        <span>💱</span>
                        <span dir="ltr">1 SAR = 0.83 TND</span>
                    </div>

                    {/* User avatar */}
                    <div className="header-avatar">
                        <span>م</span>
                    </div>
                </div>
            </header>

            {/* Search overlay */}
            {searchOpen && (
                <div className="search-overlay" onClick={() => setSearchOpen(false)}>
                    <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="search-modal-input-row">
                            <span className="search-modal-icon">🔍</span>
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="ابحث عن مصروف، محصول، حيوان، مهمة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-modal-input"
                                autoFocus
                            />
                            <kbd className="search-modal-esc" onClick={() => setSearchOpen(false)}>Esc</kbd>
                        </div>
                        {searchQuery.trim() && (
                            <div className="search-modal-results">
                                {searchResults.length === 0 ? (
                                    <div className="search-modal-empty">لا توجد نتائج لـ &quot;{searchQuery}&quot;</div>
                                ) : (
                                    searchResults.map((item, i) => (
                                        <button
                                            key={`${item.type}-${i}`}
                                            className="search-modal-result"
                                            onClick={() => { router.push(item.href); setSearchOpen(false); setSearchQuery(""); }}
                                        >
                                            <span className="search-result-icon">{item.icon}</span>
                                            <div className="search-result-info">
                                                <span className="search-result-label">{item.label}</span>
                                                <span className="search-result-sub">{item.sub}</span>
                                            </div>
                                            <span className="search-result-arrow">←</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
