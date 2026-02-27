"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Well, WaterTank, IrrigationNetwork } from "@/lib/types";
import { useWater } from "@/hooks/useWater";
import { WellsTab } from "./components/WellsTab";
import { TanksTab } from "./components/TanksTab";
import { IrrigationTab } from "./components/IrrigationTab";

type WaterTab = "wells" | "tanks" | "irrigation";

export default function ClientWater({
    initialWells,
    initialTanks,
    initialIrrigation
}: {
    initialWells: Well[];
    initialTanks: WaterTank[];
    initialIrrigation: IrrigationNetwork[];
}) {
    const { wells, tanks, irrigation } = useWater(initialWells, initialTanks, initialIrrigation);
    const [activeTab, setActiveTab] = useState<WaterTab>("wells");
    const [selectedWellId, setSelectedWellId] = useState<string | null>(null);



    /* ===== Stats ===== */
    const totalWaterSources = wells.length + tanks.length;
    const activeWells = wells.filter((w) => w.status === "active").length;
    const avgTankLevel = Math.round(
        tanks.filter((t) => t.status === "active").reduce((s, t) => s + t.current_level_percent, 0) /
        Math.max(tanks.filter((t) => t.status === "active").length, 1)
    );
    const totalIrrigationArea = irrigation.reduce((s, i) => s + i.coverage_hectares, 0);
    const totalInvestment = wells.reduce((s, w) => s + (w.total_cost || 0), 0);



    const tabs: { key: WaterTab; label: string; icon: string; count: number }[] = [
        { key: "wells", label: "الآبار", icon: "🔵", count: wells.length },
        { key: "tanks", label: "الصهاريج والخزانات", icon: "🛢️", count: tanks.length },
        { key: "irrigation", label: "شبكة الري", icon: "🌱", count: irrigation.length },
    ];



    return (
        <>

            {/* Page header */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">💧 إدارة المياه</h1>
                    <p className="page-subtitle">تتبع الآبار والخزانات وشبكات الري</p>
                </div>
            </div>

            {/* Stats */}
            <div className="water-stats-grid">
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>💧</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{totalWaterSources}</span>
                        <span className="water-stat-label">إجمالي مصادر المياه</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✅</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{activeWells}</span>
                        <span className="water-stat-label">آبار نشطة</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>🛢️</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{avgTankLevel}%</span>
                        <span className="water-stat-label">متوسط امتلاء الخزانات</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(236,72,153,0.12)", color: "#ec4899" }}>🌱</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{totalIrrigationArea} <small>هكتار</small></span>
                        <span className="water-stat-label">مساحة الري</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>💰</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{formatCurrency(totalInvestment)}</span>
                        <span className="water-stat-label">إجمالي الاستثمار في الآبار</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="water-tabs-section dashboard-section">
                <div className="water-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`water-tab ${activeTab === tab.key ? "water-tab-active" : ""}`}
                            onClick={() => { setActiveTab(tab.key); setSelectedWellId(null); }}
                        >
                            <span className="water-tab-icon">{tab.icon}</span>
                            <span className="water-tab-label">{tab.label}</span>
                            <span className="water-tab-count">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* ===== TAB: Wells ===== */}
                {activeTab === "wells" && (
                    <WellsTab
                        wells={wells}
                        selectedWellId={selectedWellId}
                        setSelectedWellId={setSelectedWellId}
                    />
                )}

                {/* ===== TAB: Tanks ===== */}
                {activeTab === "tanks" && (
                    <TanksTab tanks={tanks} />
                )}

                {/* ===== TAB: Irrigation ===== */}
                {activeTab === "irrigation" && (
                    <IrrigationTab irrigation={irrigation} />
                )}
            </div>

        </>
    );
}
