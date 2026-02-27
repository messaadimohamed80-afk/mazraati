"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";
import { useEnergy } from "@/hooks/useEnergy";
import { SolarTab } from "./components/SolarTab";
import { ElectricityTab } from "./components/ElectricityTab";
import { GeneratorsTab } from "./components/GeneratorsTab";

type EnergyTab = "solar" | "electricity" | "generators";

export default function ClientEnergy({
    initialSolar,
    initialElectricity,
    initialGenerators
}: {
    initialSolar: SolarPanel[];
    initialElectricity: ElectricityMeter[];
    initialGenerators: Generator[];
}) {
    const { solarPanels: solar, meters: electricity, generators } = useEnergy(initialSolar, initialElectricity, initialGenerators);
    const [activeTab, setActiveTab] = useState<EnergyTab>("solar");

    /* ===== Stats ===== */
    const totalSolarKw = solar.filter((s) => s.status === "active").reduce((sum, s) => sum + s.capacity_kw, 0);
    const dailyProduction = solar.reduce((sum, s) => sum + s.daily_production_kwh, 0);
    const monthlyElecCost = electricity.reduce((sum, e) => sum + e.monthly_cost, 0);
    const monthlyConsumption = electricity.reduce((sum, e) => sum + e.monthly_consumption_kwh, 0);
    const totalGenHours = generators.reduce((sum, g) => sum + g.runtime_hours, 0);
    const solarInvestment = solar.reduce((sum, s) => sum + s.total_cost, 0);

    const tabs: { key: EnergyTab; label: string; icon: string; count: number }[] = [
        { key: "solar", label: "الطاقة الشمسية", icon: "☀️", count: solar.length },
        { key: "electricity", label: "الكهرباء", icon: "🔌", count: electricity.length },
        { key: "generators", label: "المولدات", icon: "⚙️", count: generators.length },
    ];



    return (
        <>

            {/* Page header */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">⚡ إدارة الطاقة</h1>
                    <p className="page-subtitle">الطاقة الشمسية والكهرباء والمولدات</p>
                </div>
            </div>

            {/* Stats */}
            <div className="water-stats-grid">
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>☀️</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{totalSolarKw} <small>kW</small></span>
                        <span className="water-stat-label">القدرة الشمسية المُركّبة</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>⚡</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{dailyProduction} <small>kWh/يوم</small></span>
                        <span className="water-stat-label">الإنتاج اليومي</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>🔌</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{monthlyConsumption} <small>kWh</small></span>
                        <span className="water-stat-label">الاستهلاك الشهري</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>💰</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{formatCurrency(monthlyElecCost)}</span>
                        <span className="water-stat-label">فاتورة الكهرباء الشهرية</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>🕐</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{totalGenHours.toLocaleString("ar-TN")} <small>ساعة</small></span>
                        <span className="water-stat-label">ساعات تشغيل المولدات</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="water-tabs-section dashboard-section">
                <div className="water-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`water-tab ${activeTab === tab.key ? "water-tab-active" : ""}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <span className="water-tab-icon">{tab.icon}</span>
                            <span className="water-tab-label">{tab.label}</span>
                            <span className="water-tab-count">{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* ===== TAB: Solar ===== */}
                {activeTab === "solar" && (
                    <SolarTab
                        solar={solar}
                        totalSolarKw={totalSolarKw}
                        dailyProduction={dailyProduction}
                        solarInvestment={solarInvestment}
                    />
                )}

                {/* ===== TAB: Electricity ===== */}
                {activeTab === "electricity" && (
                    <ElectricityTab electricity={electricity} />
                )}

                {/* ===== TAB: Generators ===== */}
                {activeTab === "generators" && (
                    <GeneratorsTab generators={generators} />
                )}
            </div>

        </>
    );
}
