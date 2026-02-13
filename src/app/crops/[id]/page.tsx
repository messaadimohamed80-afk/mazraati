"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    MOCK_CROPS,
    MOCK_TASKS,
    CROP_STATUS_MAP,
    getCropIcon,
    getCropColor,
    getDaysUntil,
    isOverdue,
    TASK_PRIORITY_MAP,
    TASK_STATUS_MAP,
    getCropPhenologyStages,
} from "@/lib/mock-crops-tasks-data";
import { getCrop, getTasksForCrop } from "@/lib/actions/crops";

const FieldMap = dynamic(() => import("@/components/FieldMap"), { ssr: false, loading: () => <div style={{ height: 450, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>⏳ جارٍ تحميل الخريطة...</div> });
const ClimatePanel = dynamic(() => import("@/components/ClimatePanel"), { ssr: false, loading: () => <div className="climate-panel glass-card climate-loading"><div className="climate-spinner" /><span>جارٍ تحميل بيانات المناخ...</span></div> });

export default function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const mockCrop = MOCK_CROPS.find((c) => c.id === id) ?? null;
    const mockTasks = MOCK_TASKS.filter((t) => t.crop_id === id || t.id.includes("task"));
    const [crop, setCrop] = useState(mockCrop);
    const [tasks, setTasks] = useState(mockTasks);

    useEffect(() => {
        getCrop(id).then((c) => { if (c) setCrop(c); }).catch(console.error);
        getTasksForCrop(id).then(setTasks).catch(console.error);
    }, [id]);

    const cropData = crop;

    if (!crop) {
        return (
            <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                    <Header />
                    <div style={{ padding: "3rem", textAlign: "center" }}>
                        <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}>🌾 المحصول غير موجود</h2>
                        <p style={{ color: "var(--text-secondary)", margin: "1rem 0" }}>لم يتم العثور على المحصول المطلوب</p>
                        <Link href="/crops" className="crop-detail-back-btn">→ العودة للمحاصيل</Link>
                    </div>
                </main>
            </div>
        );
    }

    const statusInfo = CROP_STATUS_MAP[crop.status];
    const icon = getCropIcon(crop.crop_type);
    const color = getCropColor(crop.crop_type);
    const daysToHarvest = crop.expected_harvest ? getDaysUntil(crop.expected_harvest) : null;
    const relatedTasks = tasks.filter((t) =>
        t.title.includes(crop.crop_type) || t.description?.includes(crop.crop_type)
    );
    const phenologyStages = getCropPhenologyStages(crop.crop_type);
    const currentStageIdx = phenologyStages.findIndex((s) => s.key === crop.current_stage);

    /* Map center */
    const lat = crop.latitude || 36.7256;
    const lng = crop.longitude || 9.1817;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />

                {/* Back button */}
                <div className="crop-detail-nav">
                    <Link href="/crops" className="crop-detail-back-btn">
                        → العودة للمحاصيل
                    </Link>
                </div>

                {/* Hero card */}
                <div className="crop-detail-hero glass-card" style={{ borderTop: `3px solid ${color}` }}>
                    <div className="crop-detail-hero-header">
                        <div className="crop-detail-hero-icon" style={{ background: `${color}15`, color }}>
                            {icon}
                        </div>
                        <div className="crop-detail-hero-info">
                            <h1 className="crop-detail-hero-title">{crop.crop_type}</h1>
                            {crop.variety && <p className="crop-detail-hero-variety">{crop.variety}</p>}
                        </div>
                        <span
                            className="crop-detail-status-badge"
                            style={{ background: `${statusInfo.color}15`, color: statusInfo.color, borderColor: `${statusInfo.color}30` }}
                        >
                            {statusInfo.icon} {statusInfo.label}
                        </span>
                    </div>

                    {/* Info grid */}
                    <div className="crop-detail-info-grid">
                        <div className="crop-detail-info-item">
                            <span className="crop-detail-info-label">📍 القطعة</span>
                            <span className="crop-detail-info-value">{crop.field_name || "—"}</span>
                        </div>
                        <div className="crop-detail-info-item">
                            <span className="crop-detail-info-label">📐 المساحة</span>
                            <span className="crop-detail-info-value">{crop.area_hectares ? `${crop.area_hectares} هكتار` : "—"}</span>
                        </div>
                        <div className="crop-detail-info-item">
                            <span className="crop-detail-info-label">📅 تاريخ الزراعة</span>
                            <span className="crop-detail-info-value">{crop.planting_date || "—"}</span>
                        </div>
                        <div className="crop-detail-info-item">
                            <span className="crop-detail-info-label">🌾 الحصاد المتوقع</span>
                            <span className="crop-detail-info-value">{crop.expected_harvest || "—"}</span>
                        </div>
                        {crop.actual_harvest && (
                            <div className="crop-detail-info-item">
                                <span className="crop-detail-info-label">✅ الحصاد الفعلي</span>
                                <span className="crop-detail-info-value">{crop.actual_harvest}</span>
                            </div>
                        )}
                        {crop.yield_kg && (
                            <div className="crop-detail-info-item">
                                <span className="crop-detail-info-label">⚖️ الإنتاج</span>
                                <span className="crop-detail-info-value" style={{ color: "#10b981", fontWeight: 700 }}>
                                    {crop.yield_kg >= 1000 ? `${(crop.yield_kg / 1000).toFixed(1)} طن` : `${crop.yield_kg} كغ`}
                                </span>
                            </div>
                        )}
                        {daysToHarvest !== null && daysToHarvest > 0 && (
                            <div className="crop-detail-info-item">
                                <span className="crop-detail-info-label">⏳ أيام للحصاد</span>
                                <span className="crop-detail-info-value" style={{ color: daysToHarvest < 30 ? "#f59e0b" : "#10b981" }}>
                                    {daysToHarvest} يوم
                                </span>
                            </div>
                        )}
                    </div>

                    {crop.notes && (
                        <div className="crop-detail-notes">
                            <span className="crop-detail-notes-icon">📝</span>
                            <span>{crop.notes}</span>
                        </div>
                    )}
                </div>

                {/* Phenological Growth Stages */}
                <div className="crop-detail-phenology glass-card">
                    <h2 className="crop-detail-section-title">
                        <span className="section-title-dot" style={{ background: color }} />
                        🌱 مراحل النمو الفينولوجية
                    </h2>
                    <div className="phenology-timeline">
                        {phenologyStages.map((stage, i) => {
                            const isActive = i === currentStageIdx;
                            const isPast = i < currentStageIdx;
                            const isFuture = i > currentStageIdx;
                            return (
                                <div key={stage.key} className="phenology-stage-item">
                                    {i > 0 && (
                                        <div
                                            className={`phenology-line ${isPast || isActive ? "phenology-line-done" : ""}`}
                                            style={isPast || isActive ? { background: color } : {}}
                                        />
                                    )}
                                    <div
                                        className={`phenology-dot ${isActive ? "phenology-dot-active" : ""} ${isPast ? "phenology-dot-past" : ""} ${isFuture ? "phenology-dot-future" : ""}`}
                                        style={
                                            isActive
                                                ? { borderColor: color, boxShadow: `0 0 18px ${color}60`, background: `${color}18` }
                                                : isPast
                                                    ? { borderColor: color, background: `${color}25` }
                                                    : {}
                                        }
                                    >
                                        <span className="phenology-emoji">{stage.emoji}</span>
                                    </div>
                                    <span
                                        className={`phenology-label ${isActive ? "phenology-label-active" : ""}`}
                                        style={isActive ? { color } : {}}
                                    >
                                        {stage.label}
                                    </span>
                                    {isActive && (
                                        <span className="phenology-desc">{stage.description}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Climate Panel */}
                <ClimatePanel
                    lat={lat}
                    lng={lng}
                    cropType={crop.crop_type}
                    plantingDate={crop.planting_date}
                    cropColor={color}
                />

                {/* Two column: Map + Related Tasks */}
                <div className="crop-detail-two-col">
                    {/* Map */}
                    <div className="crop-detail-map-card glass-card">
                        <FieldMap center={[lat, lng]} existingArea={crop.area_hectares} />
                        <div className="crop-detail-map-coords">
                            <span>📍 {lat.toFixed(4)}°N, {lng.toFixed(4)}°E</span>
                            <a
                                href={`https://www.google.com/maps/@${lat},${lng},500m/data=!3m1!1e3`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="crop-detail-map-link"
                            >
                                فتح في Google Maps ↗
                            </a>
                        </div>
                    </div>

                    {/* Related tasks */}
                    <div className="crop-detail-tasks-card glass-card">
                        <h2 className="crop-detail-section-title">
                            <span className="section-title-dot" style={{ background: "#ef4444" }} />
                            ✅ المهام المرتبطة
                        </h2>
                        {relatedTasks.length === 0 ? (
                            <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "2rem" }}>
                                لا توجد مهام مرتبطة بهذا المحصول
                            </p>
                        ) : (
                            <div className="crop-detail-tasks-list">
                                {relatedTasks.map((task) => {
                                    const priority = TASK_PRIORITY_MAP[task.priority];
                                    const status = TASK_STATUS_MAP[task.status];
                                    return (
                                        <div key={task.id} className="crop-detail-task-item">
                                            <div className="crop-detail-task-header">
                                                <span className="crop-detail-task-title">{task.title}</span>
                                                <span
                                                    className="crop-detail-task-badge"
                                                    style={{ background: `${priority.color}15`, color: priority.color }}
                                                >
                                                    {priority.icon} {priority.label}
                                                </span>
                                            </div>
                                            {task.description && (
                                                <p className="crop-detail-task-desc">{task.description}</p>
                                            )}
                                            <div className="crop-detail-task-meta">
                                                {task.assigned_to && <span>👤 {task.assigned_to}</span>}
                                                {task.due_date && (
                                                    <span style={{ color: isOverdue(task.due_date) && task.status !== "done" ? "#ef4444" : "inherit" }}>
                                                        📅 {task.due_date}
                                                        {isOverdue(task.due_date) && task.status !== "done" && " ⚠️"}
                                                    </span>
                                                )}
                                                <span style={{ color: status.color }}>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
