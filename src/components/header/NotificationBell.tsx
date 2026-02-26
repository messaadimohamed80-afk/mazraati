"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Task, VaccinationRecord, FeedRecord, InventoryItem, Animal } from "@/lib/types";
import { isOverdue } from "@/lib/mock/mock-crops-tasks-data";
import { getTasks } from "@/lib/actions/crops";
import { getAnimals, getVaccinations, getFeedRecords } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";

interface NotifItem {
    id: string;
    icon: string;
    text: string;
    color: string;
    href: string;
}

function buildNotifications(
    tasks: Task[], vaccinations: VaccinationRecord[], feed: FeedRecord[],
    inventory: InventoryItem[], animals: Animal[],
): NotifItem[] {
    const notifs: NotifItem[] = [];
    const overdueTasks = tasks.filter((t) => t.status !== "done" && isOverdue(t.due_date));
    if (overdueTasks.length > 0) notifs.push({ id: "overdue-tasks", icon: "⚠️", text: `${overdueTasks.length} مهام متأخرة`, color: "#ef4444", href: "/tasks" });
    const overdueVax = vaccinations.filter((v) => v.next_due && new Date(v.next_due) < new Date());
    if (overdueVax.length > 0) notifs.push({ id: "overdue-vax", icon: "💉", text: `${overdueVax.length} تطعيم متأخر`, color: "#f59e0b", href: "/livestock" });
    const lowFeed = feed.filter((f) => f.remaining_kg / f.quantity_kg < 0.3);
    if (lowFeed.length > 0) notifs.push({ id: "low-feed", icon: "🌾", text: `${lowFeed.length} أعلاف مخزون منخفض`, color: "#f97316", href: "/livestock" });
    const lowInv = inventory.filter((i) => i.quantity <= i.min_stock);
    if (lowInv.length > 0) notifs.push({ id: "low-inv", icon: "📦", text: `${lowInv.length} مخزون منخفض`, color: "#ec4899", href: "/inventory" });
    const sickAnimals = animals.filter((a) => a.status === "sick");
    if (sickAnimals.length > 0) notifs.push({ id: "sick", icon: "🤒", text: `${sickAnimals.length} حيوان مريض`, color: "#ef4444", href: "/livestock" });
    return notifs;
}

export default function NotificationBell() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
    const [feed, setFeed] = useState<FeedRecord[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);

    const loadData = useCallback(() => {
        if (dataLoaded) return;
        setDataLoaded(true);
        Promise.all([
            getTasks().then(setTasks).catch(() => { }),
            getVaccinations().then(setVaccinations).catch(() => { }),
            getFeedRecords().then(setFeed).catch(() => { }),
            getInventory().then(setInventory).catch(() => { }),
            getAnimals().then(setAnimals).catch(() => { }),
        ]);
    }, [dataLoaded]);

    const notifications = useMemo(
        () => buildNotifications(tasks, vaccinations, feed, inventory, animals),
        [tasks, vaccinations, feed, inventory, animals]
    );

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="header-notif-wrapper">
            <button
                className="header-icon-btn"
                aria-label="الإشعارات"
                onClick={() => { loadData(); setOpen(!open); }}
            >
                <span>🔔</span>
                {notifications.length > 0 && (
                    <span className="header-notif-dot">{notifications.length}</span>
                )}
            </button>
            {open && (
                <div className="header-notif-dropdown">
                    <div className="header-notif-title">🔔 التنبيهات</div>
                    {notifications.length === 0 ? (
                        <div className="header-notif-empty">لا توجد تنبيهات</div>
                    ) : (
                        notifications.map((n) => (
                            <button
                                key={n.id}
                                className="header-notif-item"
                                onClick={() => { router.push(n.href); setOpen(false); }}
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
    );
}
