"use client";

import { useState, useMemo } from "react";
import {
    MOCK_WELL_LAYERS,
    WELL_STATUS_MAP,
    WATER_QUALITY_MAP,
    TANK_TYPE_MAP,
    TANK_STATUS_MAP,
    IRRIGATION_TYPE_MAP,
    IRRIGATION_STATUS_MAP,
} from "@/lib/mock/mock-water-data";
import { formatCurrency } from "@/lib/utils";
import { Well, WaterTank, IrrigationNetwork } from "@/lib/types";
import { useWater } from "@/hooks/useWater";

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

    /* ===== Well layers for selected well ===== */
    const selectedWell = wells.find((w) => w.id === selectedWellId);
    const wellLayers = useMemo(
        () => MOCK_WELL_LAYERS.filter((l) => l.well_id === selectedWellId),
        [selectedWellId]
    );

    const LAYER_COLORS: Record<string, string> = {
        soil: "#8B6914",
        clay: "#CD853F",
        rock: "#708090",
        sand: "#F4A460",
        water: "#4FC3F7",
        gravel: "#A0A0A0",
    };
    const LAYER_LABELS: Record<string, string> = {
        soil: "تربة",
        clay: "طين",
        rock: "صخر",
        sand: "رمل",
        water: "ماء",
        gravel: "حصى",
    };

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
                    <div className="water-content">
                        <div className="water-cards-grid">
                            {wells.map((well) => {
                                const status = WELL_STATUS_MAP[well.status];
                                const quality = WATER_QUALITY_MAP[well.water_quality];
                                const waterPercent = well.water_level_meters
                                    ? Math.round((1 - well.water_level_meters / well.depth_meters) * 100)
                                    : 0;
                                const isSelected = selectedWellId === well.id;

                                return (
                                    <div
                                        key={well.id}
                                        className={`water-card glass-card ${isSelected ? "water-card-selected" : ""}`}
                                        onClick={() => setSelectedWellId(isSelected ? null : well.id)}
                                    >
                                        <div className="water-card-header">
                                            <h3 className="water-card-name">{well.name}</h3>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                            >
                                                {status.icon} {status.label}
                                            </span>
                                        </div>

                                        {/* Well visualization */}
                                        <div className="well-viz">
                                            <div className="well-tube">
                                                <div
                                                    className="well-water"
                                                    style={{ height: `${waterPercent}%` }}
                                                />
                                                <div className="well-depth-label">
                                                    {well.depth_meters} م
                                                </div>
                                                {well.water_level_meters && (
                                                    <div
                                                        className="well-level-marker"
                                                        style={{ top: `${(well.water_level_meters / well.depth_meters) * 100}%` }}
                                                    >
                                                        <span className="well-level-text">{well.water_level_meters} م</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="water-card-details">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">العمق</span>
                                                <span className="water-detail-value">{well.depth_meters} متر</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">مستوى الماء</span>
                                                <span className="water-detail-value">
                                                    {well.water_level_meters ? `${well.water_level_meters} م` : "—"}
                                                </span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">الملوحة</span>
                                                <span className="water-detail-value" style={{ color: quality.color }}>
                                                    {well.salinity_ppm ? `${well.salinity_ppm} ppm` : quality.label}
                                                </span>
                                            </div>
                                            {well.total_cost && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">التكلفة</span>
                                                    <span className="water-detail-value">{formatCurrency(well.total_cost)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {isSelected && <div className="water-card-expand-hint">▲ انقر لإخفاء الطبقات</div>}
                                        {!isSelected && well.status !== "inactive" && (
                                            <div className="water-card-expand-hint">▼ انقر لعرض الطبقات الجيولوجية</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Well Layers Detail */}
                        {selectedWell && wellLayers.length > 0 && (
                            <div className="well-layers-panel glass-card">
                                <h3 className="well-layers-title">
                                    🪨 الطبقات الجيولوجية — {selectedWell.name}
                                </h3>
                                <div className="well-layers-viz">
                                    {wellLayers.map((layer) => {
                                        const heightPercent = ((layer.depth_to - layer.depth_from) / selectedWell.depth_meters) * 100;
                                        return (
                                            <div
                                                key={layer.id}
                                                className="well-layer-bar"
                                                style={{
                                                    height: `${Math.max(heightPercent, 8)}%`,
                                                    background: LAYER_COLORS[layer.layer_type] || "#666",
                                                }}
                                            >
                                                <span className="well-layer-label">
                                                    {LAYER_LABELS[layer.layer_type]} ({layer.depth_from}-{layer.depth_to} م)
                                                </span>
                                                {layer.notes && (
                                                    <span className="well-layer-note">{layer.notes}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="well-layers-legend">
                                    {Object.entries(LAYER_LABELS).map(([key, label]) => (
                                        <span key={key} className="well-layer-legend-item">
                                            <span className="well-layer-dot" style={{ background: LAYER_COLORS[key] }} />
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== TAB: Tanks ===== */}
                {activeTab === "tanks" && (
                    <div className="water-content">
                        <div className="water-cards-grid">
                            {tanks.map((tank) => {
                                const typeInfo = TANK_TYPE_MAP[tank.type];
                                const statusInfo = TANK_STATUS_MAP[tank.status];
                                const levelColor =
                                    tank.current_level_percent > 60
                                        ? "#10b981"
                                        : tank.current_level_percent > 25
                                            ? "#f59e0b"
                                            : "#ef4444";

                                return (
                                    <div key={tank.id} className="water-card glass-card">
                                        <div className="water-card-header">
                                            <h3 className="water-card-name">{tank.name}</h3>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${statusInfo.color}18`, color: statusInfo.color, borderColor: `${statusInfo.color}40` }}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Tank level gauge */}
                                        <div className="tank-gauge">
                                            <div className="tank-gauge-container">
                                                <div
                                                    className="tank-gauge-fill"
                                                    style={{
                                                        height: `${tank.current_level_percent}%`,
                                                        background: `linear-gradient(to top, ${levelColor}dd, ${levelColor}88)`,
                                                    }}
                                                />
                                                <div className="tank-gauge-label">
                                                    <span className="tank-gauge-percent" style={{ color: levelColor }}>{tank.current_level_percent}%</span>
                                                </div>
                                            </div>
                                            <div className="tank-gauge-capacity">
                                                {(tank.capacity_liters / 1000).toFixed(0)} م³
                                            </div>
                                        </div>

                                        <div className="water-card-details">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">النوع</span>
                                                <span className="water-detail-value">{typeInfo.icon} {typeInfo.label}</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">السعة</span>
                                                <span className="water-detail-value">{(tank.capacity_liters / 1000).toFixed(0)} م³</span>
                                            </div>
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">المصدر</span>
                                                <span className="water-detail-value">{tank.source}</span>
                                            </div>
                                            {tank.last_filled && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">آخر تعبئة</span>
                                                    <span className="water-detail-value">
                                                        {new Date(tank.last_filled).toLocaleDateString("ar-TN")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {tank.notes && (
                                            <div className="water-card-note">{tank.notes}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ===== TAB: Irrigation ===== */}
                {activeTab === "irrigation" && (
                    <div className="water-content">
                        <div className="water-cards-grid water-cards-wide">
                            {irrigation.map((irr) => {
                                const typeInfo = IRRIGATION_TYPE_MAP[irr.type];
                                const statusInfo = IRRIGATION_STATUS_MAP[irr.status];

                                return (
                                    <div key={irr.id} className="water-card glass-card water-card-wide">
                                        <div className="water-card-header">
                                            <div>
                                                <h3 className="water-card-name">{irr.name}</h3>
                                                <span className="water-card-type-tag">
                                                    {typeInfo.icon} {typeInfo.label}
                                                </span>
                                            </div>
                                            <span
                                                className="water-card-badge"
                                                style={{ background: `${statusInfo.color}18`, color: statusInfo.color, borderColor: `${statusInfo.color}40` }}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Coverage bar */}
                                        <div className="irr-coverage">
                                            <div className="irr-coverage-header">
                                                <span>المساحة المغطاة</span>
                                                <span className="irr-coverage-value">{irr.coverage_hectares} هكتار</span>
                                            </div>
                                            <div className="irr-coverage-bar">
                                                <div
                                                    className="irr-coverage-fill"
                                                    style={{
                                                        width: `${Math.min((irr.coverage_hectares / 3) * 100, 100)}%`,
                                                        background: statusInfo.color,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="water-card-details water-card-details-row">
                                            <div className="water-card-detail">
                                                <span className="water-detail-label">المصدر</span>
                                                <span className="water-detail-value">{irr.source_name}</span>
                                            </div>
                                            {irr.flow_rate_lph && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">التدفق</span>
                                                    <span className="water-detail-value">{irr.flow_rate_lph} لتر/ساعة</span>
                                                </div>
                                            )}
                                            {irr.last_maintenance && (
                                                <div className="water-card-detail">
                                                    <span className="water-detail-label">آخر صيانة</span>
                                                    <span className="water-detail-value">
                                                        {new Date(irr.last_maintenance).toLocaleDateString("ar-TN")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {irr.notes && (
                                            <div className="water-card-note">{irr.notes}</div>
                                        )}
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
