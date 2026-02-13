"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    MOCK_CROPS,
    CROP_STATUS_MAP,
    getCropIcon,
    getCropColor,
    getDaysUntil,
} from "@/lib/mock-crops-tasks-data";
import { getCrops } from "@/lib/actions/crops";
import Footer from "@/components/Footer";

type CropFilter = "all" | "planned" | "planted" | "growing" | "harvested";

export default function CropsPage() {
    const [filter, setFilter] = useState<CropFilter>("all");
    const [search, setSearch] = useState("");
    const [crops, setCrops] = useState(MOCK_CROPS);

    useEffect(() => {
        getCrops().then(setCrops).catch(console.error);
    }, []);

    const filtered = useMemo(() => {
        return crops.filter((c) => {
            if (filter !== "all" && c.status !== filter) return false;
            if (search && !c.crop_type.includes(search) && !c.variety?.includes(search) && !c.field_name?.includes(search)) return false;
            return true;
        });
    }, [filter, search, crops]);

    /* Stats */
    const totalArea = MOCK_CROPS.reduce((s, c) => s + (c.area_hectares || 0), 0);
    const activeCrops = MOCK_CROPS.filter((c) => c.status === "growing" || c.status === "planted").length;
    const harvestedCount = MOCK_CROPS.filter((c) => c.status === "harvested").length;
    const totalYield = MOCK_CROPS.reduce((s, c) => s + (c.yield_kg || 0), 0);

    const statusFilters: { key: CropFilter; label: string; count: number }[] = [
        { key: "all", label: "الكل", count: MOCK_CROPS.length },
        { key: "growing", label: "ينمو", count: MOCK_CROPS.filter((c) => c.status === "growing").length },
        { key: "planted", label: "مزروع", count: MOCK_CROPS.filter((c) => c.status === "planted").length },
        { key: "planned", label: "مخطط", count: MOCK_CROPS.filter((c) => c.status === "planned").length },
        { key: "harvested", label: "تم الحصاد", count: MOCK_CROPS.filter((c) => c.status === "harvested").length },
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />

                {/* Page header */}
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">🌾 إدارة المحاصيل</h1>
                        <p className="page-subtitle">تتبع المحاصيل والمواسم والإنتاج</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="water-stats-grid crops-stats">
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>🌿</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{activeCrops}</span>
                            <span className="water-stat-label">محاصيل نشطة</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>📐</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{totalArea} <small>هكتار</small></span>
                            <span className="water-stat-label">إجمالي المساحة</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>✅</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{harvestedCount}</span>
                            <span className="water-stat-label">تم حصادها</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>⚖️</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{totalYield > 0 ? `${(totalYield / 1000).toFixed(1)} طن` : "—"}</span>
                            <span className="water-stat-label">إجمالي الإنتاج</span>
                        </div>
                    </div>
                </div>

                {/* Filters + Search */}
                <div className="crops-toolbar">
                    <div className="crops-filters">
                        {statusFilters.map((f) => (
                            <button
                                key={f.key}
                                className={`crops-filter-btn ${filter === f.key ? "crops-filter-active" : ""}`}
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label} <span className="crops-filter-count">{f.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="crops-search">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="ابحث عن محصول..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="crops-search-input"
                        />
                    </div>
                </div>

                {/* Crop Cards */}
                <div className="crops-grid">
                    {filtered.map((crop) => {
                        const status = CROP_STATUS_MAP[crop.status];
                        const icon = getCropIcon(crop.crop_type);
                        const color = getCropColor(crop.crop_type);
                        const daysToHarvest = crop.expected_harvest ? getDaysUntil(crop.expected_harvest) : null;
                        const growthPercent = crop.planting_date && crop.expected_harvest
                            ? Math.min(Math.max(
                                Math.round(((Date.now() - new Date(crop.planting_date).getTime()) / (new Date(crop.expected_harvest).getTime() - new Date(crop.planting_date).getTime())) * 100),
                                0), 100)
                            : 0;

                        return (
                            <Link key={crop.id} href={`/crops/${crop.id}`} className="crop-card glass-card" style={{ textDecoration: "none", cursor: "pointer" }}>
                                {/* Header */}
                                <div className="crop-card-header">
                                    <div className="crop-card-icon" style={{ background: `${color}18`, color: color }}>
                                        {icon}
                                    </div>
                                    <div className="crop-card-title-area">
                                        <h3 className="crop-card-name">{crop.crop_type}</h3>
                                        {crop.variety && <span className="crop-card-variety">{crop.variety}</span>}
                                    </div>
                                    <span
                                        className="water-card-badge"
                                        style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                    >
                                        {status.icon} {status.label}
                                    </span>
                                </div>

                                {/* Growth bar */}
                                {crop.status !== "planned" && crop.status !== "harvested" && growthPercent > 0 && (
                                    <div className="crop-growth">
                                        <div className="crop-growth-header">
                                            <span>تقدم النمو</span>
                                            <span style={{ color, fontWeight: 700 }}>{growthPercent}%</span>
                                        </div>
                                        <div className="irr-coverage-bar">
                                            <div className="irr-coverage-fill" style={{ width: `${growthPercent}%`, background: color }} />
                                        </div>
                                        {daysToHarvest !== null && daysToHarvest > 0 && (
                                            <span className="crop-harvest-countdown">
                                                🗓️ {daysToHarvest} يوم للحصاد
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Harvested badge */}
                                {crop.status === "harvested" && crop.yield_kg && (
                                    <div className="crop-yield-badge">
                                        <span className="crop-yield-icon">🏆</span>
                                        <span className="crop-yield-val">{(crop.yield_kg / 1000).toFixed(1)} طن</span>
                                        <span className="crop-yield-label">إنتاج الموسم</span>
                                    </div>
                                )}

                                {/* Details */}
                                <div className="water-card-details">
                                    {crop.field_name && (
                                        <div className="water-card-detail">
                                            <span className="water-detail-label">القطعة</span>
                                            <span className="water-detail-value">{crop.field_name}</span>
                                        </div>
                                    )}
                                    {crop.area_hectares && (
                                        <div className="water-card-detail">
                                            <span className="water-detail-label">المساحة</span>
                                            <span className="water-detail-value">{crop.area_hectares} هكتار</span>
                                        </div>
                                    )}
                                    {crop.planting_date && (
                                        <div className="water-card-detail">
                                            <span className="water-detail-label">تاريخ الزراعة</span>
                                            <span className="water-detail-value">
                                                {new Date(crop.planting_date).toLocaleDateString("ar-TN")}
                                            </span>
                                        </div>
                                    )}
                                    {crop.expected_harvest && (
                                        <div className="water-card-detail">
                                            <span className="water-detail-label">الحصاد المتوقع</span>
                                            <span className="water-detail-value">
                                                {new Date(crop.expected_harvest).toLocaleDateString("ar-TN")}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {crop.notes && <div className="water-card-note">{crop.notes}</div>}
                            </Link>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div className="crops-empty">
                            <span>🌱</span>
                            <p>لا توجد محاصيل مطابقة</p>
                        </div>
                    )}
                </div>

                <Footer />
            </main>
        </div>
    );
}
