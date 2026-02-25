"use client";

import { useState, useEffect } from "react";
import {
    SOLAR_STATUS_MAP,
    ELEC_STATUS_MAP,
    ELEC_TARIFF_MAP,
    GEN_STATUS_MAP,
    FUEL_TYPE_MAP,
} from "@/lib/mock-energy-data";
import { formatCurrency } from "@/lib/utils";
import { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";
import { getSolarPanels, getElectricityMeters, getGenerators } from "@/lib/actions/energy";

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
    const [activeTab, setActiveTab] = useState<EnergyTab>("solar");
    const [solar, setSolar] = useState<SolarPanel[]>(initialSolar);
    const [electricity, setElectricity] = useState<ElectricityMeter[]>(initialElectricity);
    const [generators, setGenerators] = useState<Generator[]>(initialGenerators);

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
                    <div className="water-content">
                        <div className="water-cards-grid">
                            {solar.map((panel) => {
                                const status = SOLAR_STATUS_MAP[panel.status];
                                const effColor =
                                    panel.efficiency_percent > 75 ? "#10b981"
                                        : panel.efficiency_percent > 50 ? "#f59e0b"
                                            : "#ef4444";

                                return (
                                    <div key={panel.id} className="water-card glass-card">
                                        <div className="water-card-header">
                                            <h3 className="water-card-name">{panel.name}</h3>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                            >
                                                {status.icon} {status.label}
                                            </span>
                                        </div>

                                        {/* Solar production gauge */}
                                        {panel.status === "active" && (
                                            <div className="energy-gauge-area">
                                                <div className="energy-ring-gauge">
                                                    <svg viewBox="0 0 100 100" className="energy-ring-svg">
                                                        <circle cx="50" cy="50" r="42" className="energy-ring-bg" />
                                                        <circle
                                                            cx="50" cy="50" r="42"
                                                            className="energy-ring-fill"
                                                            style={{
                                                                strokeDasharray: `${(panel.efficiency_percent / 100) * 264} 264`,
                                                                stroke: effColor,
                                                            }}
                                                        />
                                                    </svg>
                                                    <div className="energy-ring-value">
                                                        <span className="energy-ring-num" style={{ color: effColor }}>{panel.efficiency_percent}%</span>
                                                        <span className="energy-ring-label">كفاءة</span>
                                                    </div>
                                                </div>
                                                <div className="energy-gauge-stats">
                                                    <div className="energy-gauge-stat">
                                                        <span className="energy-gauge-stat-val">{panel.daily_production_kwh}</span>
                                                        <span className="energy-gauge-stat-lbl">kWh/يوم</span>
                                                    </div>
                                                    <div className="energy-gauge-stat">
                                                        <span className="energy-gauge-stat-val">{panel.capacity_kw}</span>
                                                        <span className="energy-gauge-stat-lbl">kW قدرة</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="water-card-details">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">عدد الألواح</span>
                                                <span className="water-detail-value">{panel.panel_count} لوح</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">الانفرتر</span>
                                                <span className="water-detail-value">{panel.inverter_type}</span>
                                            </div>
                                            {panel.installation_date && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">تاريخ التركيب</span>
                                                    <span className="water-detail-value">
                                                        {new Date(panel.installation_date).toLocaleDateString("ar-TN")}
                                                    </span>
                                                </div>
                                            )}
                                            {panel.total_cost > 0 && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">التكلفة</span>
                                                    <span className="water-detail-value">{formatCurrency(panel.total_cost)}</span>
                                                </div>
                                            )}
                                        </div>
                                        {panel.notes && <div className="water-card-note">{panel.notes}</div>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Solar summary */}
                        <div className="energy-summary glass-card">
                            <h4 className="energy-summary-title">📊 ملخص الطاقة الشمسية</h4>
                            <div className="energy-summary-grid">
                                <div className="energy-summary-item">
                                    <span className="energy-summary-val">{solar.reduce((s, p) => s + p.panel_count, 0)}</span>
                                    <span className="energy-summary-lbl">إجمالي الألواح</span>
                                </div>
                                <div className="energy-summary-item">
                                    <span className="energy-summary-val">{totalSolarKw} kW</span>
                                    <span className="energy-summary-lbl">القدرة الإجمالية</span>
                                </div>
                                <div className="energy-summary-item">
                                    <span className="energy-summary-val">{dailyProduction} kWh</span>
                                    <span className="energy-summary-lbl">الإنتاج اليومي</span>
                                </div>
                                <div className="energy-summary-item">
                                    <span className="energy-summary-val">{formatCurrency(solarInvestment)}</span>
                                    <span className="energy-summary-lbl">إجمالي الاستثمار</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== TAB: Electricity ===== */}
                {activeTab === "electricity" && (
                    <div className="water-content">
                        <div className="water-cards-grid water-cards-wide">
                            {electricity.map((meter) => {
                                const status = ELEC_STATUS_MAP[meter.status];
                                const consumptionPercent = Math.min((meter.monthly_consumption_kwh / 600) * 100, 100);

                                return (
                                    <div key={meter.id} className="water-card glass-card water-card-wide">
                                        <div className="water-card-header">
                                            <div>
                                                <h3 className="water-card-name">{meter.name}</h3>
                                                <span className="water-card-type-tag">
                                                    🏷️ {ELEC_TARIFF_MAP[meter.tariff_type]}
                                                </span>
                                            </div>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Consumption bar */}
                                        <div className="irr-coverage">
                                            <div className="irr-coverage-header">
                                                <span>الاستهلاك الشهري</span>
                                                <span className="irr-coverage-value">{meter.monthly_consumption_kwh} kWh</span>
                                            </div>
                                            <div className="irr-coverage-bar" style={{ height: "12px" }}>
                                                <div
                                                    className="irr-coverage-fill"
                                                    style={{
                                                        width: `${consumptionPercent}%`,
                                                        background: consumptionPercent > 80 ? "#ef4444" : consumptionPercent > 50 ? "#f59e0b" : "#10b981",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="water-card-details water-card-details-row">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">رقم العداد</span>
                                                <span className="water-detail-value" style={{ fontSize: "0.75rem", direction: "ltr" }}>{meter.meter_number}</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">المزوّد</span>
                                                <span className="water-detail-value">{meter.provider}</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">الفاتورة الشهرية</span>
                                                <span className="water-detail-value" style={{ color: "#ef4444", fontWeight: 800 }}>
                                                    {formatCurrency(meter.monthly_cost)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="water-card-details" style={{ marginTop: "0.5rem" }}>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">آخر قراءة</span>
                                                <span className="water-detail-value">
                                                    {new Date(meter.last_reading_date).toLocaleDateString("ar-TN")}
                                                </span>
                                            </div>
                                        </div>
                                        {meter.notes && <div className="water-card-note">{meter.notes}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== TAB: Generators ===== */}
                {activeTab === "generators" && (
                    <div className="water-content">
                        <div className="water-cards-grid">
                            {generators.map((gen) => {
                                const status = GEN_STATUS_MAP[gen.status];
                                const fuel = FUEL_TYPE_MAP[gen.fuel_type];
                                const maintenancePercent = Math.round((gen.runtime_hours / gen.next_maintenance_hours) * 100);
                                const maintenanceColor = maintenancePercent > 90 ? "#ef4444" : maintenancePercent > 70 ? "#f59e0b" : "#10b981";

                                return (
                                    <div key={gen.id} className="water-card glass-card">
                                        <div className="water-card-header">
                                            <h3 className="water-card-name">{gen.name}</h3>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                            >
                                                {status.icon} {status.label}
                                            </span>
                                        </div>

                                        {/* Runtime gauge */}
                                        <div className="gen-runtime">
                                            <div className="gen-runtime-header">
                                                <span>الصيانة القادمة</span>
                                                <span style={{ color: maintenanceColor, fontWeight: 700 }}>{maintenancePercent}%</span>
                                            </div>
                                            <div className="irr-coverage-bar">
                                                <div
                                                    className="irr-coverage-fill"
                                                    style={{
                                                        width: `${maintenancePercent}%`,
                                                        background: maintenanceColor,
                                                    }}
                                                />
                                            </div>
                                            <div className="gen-runtime-info">
                                                <span>{gen.runtime_hours} ساعة</span>
                                                <span>من {gen.next_maintenance_hours} ساعة</span>
                                            </div>
                                        </div>

                                        <div className="water-card-details">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">الوقود</span>
                                                <span className="water-detail-value">{fuel.icon} {fuel.label}</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">القدرة</span>
                                                <span className="water-detail-value">{gen.capacity_kva} kVA</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">استهلاك الوقود</span>
                                                <span className="water-detail-value">{gen.fuel_consumption_lph} لتر/ساعة</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">آخر صيانة</span>
                                                <span className="water-detail-value">
                                                    {new Date(gen.last_maintenance).toLocaleDateString("ar-TN")}
                                                </span>
                                            </div>
                                        </div>
                                        {gen.total_cost > 0 && (
                                            <div className="water-card-details" style={{ marginTop: "0.5rem" }}>
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">التكلفة</span>
                                                    <span className="water-detail-value">{formatCurrency(gen.total_cost)}</span>
                                                </div>
                                            </div>
                                        )}
                                        {gen.notes && <div className="water-card-note">{gen.notes}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}
