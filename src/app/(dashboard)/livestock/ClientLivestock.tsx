"use client";

import { useState, useMemo } from "react";
import LivestockModal from "@/components/LivestockModal";
import { formatCurrency } from "@/lib/utils";
import { Animal, VaccinationRecord, FeedRecord } from "@/lib/types";
import { useLivestock } from "@/hooks/useLivestock";
import { AnimalsTab } from "./components/AnimalsTab";
import { VaccinationsTab } from "./components/VaccinationsTab";
import { FeedTab } from "./components/FeedTab";

type TabKey = "all" | "sheep" | "cattle" | "poultry" | "goat";
type ViewMode = "animals" | "vaccinations" | "feed";

export default function ClientLivestock({
    initialAnimals,
    initialVaccinations,
    initialFeed
}: {
    initialAnimals: Animal[];
    initialVaccinations: VaccinationRecord[];
    initialFeed: FeedRecord[];
}) {
    const { animals, vaccinations, feedRecords: feed } = useLivestock(initialAnimals, initialVaccinations, initialFeed);
    const [tab, setTab] = useState<TabKey>("all");
    const [view, setView] = useState<ViewMode>("animals");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const activeAnimals = animals.filter((a) => a.status !== "sold" && a.status !== "deceased");
    const cattleCount = activeAnimals.filter((a) => a.type === "cattle").length;
    const sickCount = activeAnimals.filter((a) => a.status === "sick").length;
    const pregnantCount = activeAnimals.filter((a) => a.status === "pregnant").length;

    const totalFeedCost = feed.reduce((s, f) => s + f.quantity_kg * f.cost_per_kg, 0);
    const totalPurchaseCost = animals.filter((a) => a.purchase_price).reduce((s, a) => s + (a.purchase_price || 0), 0);

    const filteredAnimals = useMemo(() => {
        return animals.filter((a) => {
            if (tab !== "all" && a.type !== tab) return false;
            if (search && !a.name.includes(search) && !a.breed.includes(search) && !a.tag_number.includes(search)) return false;
            return true;
        });
    }, [tab, search, animals]);

    const tabs: { key: TabKey; label: string; icon: string; count: number }[] = [
        { key: "all", label: "الكل", icon: "📋", count: animals.length },
        { key: "sheep", label: "أغنام", icon: "🐑", count: animals.filter((a) => a.type === "sheep").length },
        { key: "cattle", label: "أبقار", icon: "🐄", count: animals.filter((a) => a.type === "cattle").length },
        { key: "poultry", label: "دواجن", icon: "🐔", count: animals.filter((a) => a.type === "poultry").length },
        { key: "goat", label: "ماعز", icon: "🐐", count: animals.filter((a) => a.type === "goat").length },
    ];

    const viewTabs: { key: ViewMode; label: string; icon: string }[] = [
        { key: "animals", label: "القطيع", icon: "🐑" },
        { key: "vaccinations", label: "التطعيمات", icon: "💉" },
        { key: "feed", label: "الأعلاف", icon: "🌾" },
    ];

    const upcomingVaccinations = vaccinations.filter((v) => {
        if (!v.next_due) return false;
        const due = new Date(v.next_due);
        const now = new Date();
        const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 30 && diff >= 0;
    });

    const lowFeed = feed.filter((f) => f.remaining_kg / f.quantity_kg < 0.3);



    return (
        <>

            {/* Page header */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">🐑 إدارة المواشي</h1>
                    <p className="page-subtitle">متابعة القطيع والصحة والتغذية</p>
                </div>
                <button className="modal-btn modal-btn-save" onClick={() => setShowModal(true)}>+ إضافة حيوان</button>
            </div>

            {/* Stats */}
            <div className="water-stats-grid">
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>🐑</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{activeAnimals.length}</span>
                        <span className="water-stat-label">إجمالي الرؤوس</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>🐄</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{cattleCount}</span>
                        <span className="water-stat-label">أبقار</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>💚</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{activeAnimals.filter((a) => a.status === "healthy").length}</span>
                        <span className="water-stat-label">بصحة جيدة</span>
                    </div>
                </div>
                {sickCount > 0 && (
                    <div className="water-stat-card" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                        <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>🤒</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value" style={{ color: "#ef4444" }}>{sickCount}</span>
                            <span className="water-stat-label">مريض</span>
                        </div>
                    </div>
                )}
                {pregnantCount > 0 && (
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>🤰</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{pregnantCount}</span>
                            <span className="water-stat-label">حامل</span>
                        </div>
                    </div>
                )}
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(100,116,139,0.12)", color: "#64748b" }}>💰</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{formatCurrency(totalPurchaseCost + totalFeedCost)}</span>
                        <span className="water-stat-label">إجمالي التكاليف</span>
                    </div>
                </div>
            </div>

            {/* View mode tabs */}
            <div className="energy-tabs" style={{ marginBottom: "1rem" }}>
                {viewTabs.map((v) => (
                    <button
                        key={v.key}
                        className={`energy-tab ${view === v.key ? "energy-tab-active" : ""}`}
                        onClick={() => setView(v.key)}
                    >
                        {v.icon} {v.label}
                    </button>
                ))}
            </div>

            {/* === ANIMALS TAB === */}
            {view === "animals" && (
                <AnimalsTab
                    filteredAnimals={filteredAnimals}
                    vaccinations={vaccinations}
                    tabs={tabs}
                    tab={tab}
                    setTab={setTab}
                    search={search}
                    setSearch={setSearch}
                />
            )}

            {/* === VACCINATIONS TAB === */}
            {view === "vaccinations" && (
                <VaccinationsTab
                    vaccinations={vaccinations}
                    animals={animals}
                    upcomingVaccinations={upcomingVaccinations}
                />
            )}

            {/* === FEED TAB === */}
            {view === "feed" && (
                <FeedTab feed={feed} lowFeed={lowFeed} />
            )}

            {showModal && <LivestockModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); }} />}
        </>
    );
}
