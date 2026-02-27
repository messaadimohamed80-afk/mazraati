"use client";

import { useState, useMemo } from "react";
import LivestockModal from "@/components/LivestockModal";
import {
    ANIMAL_TYPE_MAP,
    ANIMAL_STATUS_MAP,
    GENDER_MAP,
} from "@/lib/mock/mock-livestock-data";
import { formatCurrency } from "@/lib/utils";
import { Animal, VaccinationRecord, FeedRecord } from "@/lib/types";
import { useLivestock } from "@/hooks/useLivestock";

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
    const { animals, vaccinations, feedRecords: feed, createAnimal: _createAnimal } = useLivestock(initialAnimals, initialVaccinations, initialFeed);
    const [tab, setTab] = useState<TabKey>("all");
    const [view, setView] = useState<ViewMode>("animals");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const activeAnimals = animals.filter((a) => a.status !== "sold" && a.status !== "deceased");
    const _sheepCount = activeAnimals.filter((a) => a.type === "sheep").length;
    const cattleCount = activeAnimals.filter((a) => a.type === "cattle").length;
    const _poultryCount = activeAnimals.filter((a) => a.type === "poultry").length;
    const _goatCount = activeAnimals.filter((a) => a.type === "goat").length;
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
                <>
                    {/* Type filter + search */}
                    <div className="crops-toolbar">
                        <div className="crops-filters">
                            {tabs.map((t) => (
                                <button
                                    key={t.key}
                                    className={`crops-filter-btn ${tab === t.key ? "crops-filter-active" : ""}`}
                                    onClick={() => setTab(t.key)}
                                >
                                    {t.icon} {t.label} <span className="crops-filter-count">{t.count}</span>
                                </button>
                            ))}
                        </div>
                        <div className="crops-search">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="ابحث عن حيوان..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="crops-search-input"
                            />
                        </div>
                    </div>

                    {/* Animal cards */}
                    <div className="livestock-grid">
                        {filteredAnimals.map((animal) => {
                            const typeInfo = ANIMAL_TYPE_MAP[animal.type];
                            const statusInfo = ANIMAL_STATUS_MAP[animal.status];
                            const genderInfo = GENDER_MAP[animal.gender];
                            const animalVax = vaccinations.filter((v) => v.animal_id === animal.id);
                            const latestVax = animalVax.length > 0 ? animalVax[animalVax.length - 1] : null;

                            return (
                                <div key={animal.id} className="livestock-card glass-card">
                                    <div className="livestock-card-accent" style={{ background: typeInfo.color }} />
                                    <div className="livestock-card-header">
                                        <div className="livestock-card-icon" style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}>
                                            {typeInfo.icon}
                                        </div>
                                        <div className="livestock-card-title-area">
                                            <h3 className="livestock-card-name">{animal.tag_number}</h3>
                                            <span className="livestock-card-tag">{animal.name}</span>
                                        </div>
                                        <span
                                            className="livestock-status-badge"
                                            style={{ background: `${statusInfo.color}15`, color: statusInfo.color, borderColor: `${statusInfo.color}30` }}
                                        >
                                            {statusInfo.icon} {statusInfo.label}
                                        </span>
                                    </div>

                                    <div className="livestock-card-details">
                                        <div className="livestock-detail">
                                            <span className="livestock-detail-label">النوع</span>
                                            <span className="livestock-detail-value">{typeInfo.label}</span>
                                        </div>
                                        <div className="livestock-detail">
                                            <span className="livestock-detail-label">السلالة</span>
                                            <span className="livestock-detail-value">{animal.breed}</span>
                                        </div>
                                        <div className="livestock-detail">
                                            <span className="livestock-detail-label">الجنس</span>
                                            <span className="livestock-detail-value">{genderInfo.icon} {genderInfo.label}</span>
                                        </div>
                                        {animal.weight_kg && (
                                            <div className="livestock-detail">
                                                <span className="livestock-detail-label">الوزن</span>
                                                <span className="livestock-detail-value">{animal.weight_kg} كغ</span>
                                            </div>
                                        )}
                                        {animal.birth_date && (
                                            <div className="livestock-detail">
                                                <span className="livestock-detail-label">تاريخ الولادة</span>
                                                <span className="livestock-detail-value">{new Date(animal.birth_date).toLocaleDateString("ar-TN")}</span>
                                            </div>
                                        )}
                                        {animal.purchase_price && (
                                            <div className="livestock-detail">
                                                <span className="livestock-detail-label">ثمن الشراء</span>
                                                <span className="livestock-detail-value">{formatCurrency(animal.purchase_price)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {latestVax && (
                                        <div className="livestock-card-vax">
                                            💉 آخر تطعيم: {latestVax.vaccine_name}
                                            {latestVax.next_due && (
                                                <span className="livestock-vax-next"> — القادم: {new Date(latestVax.next_due).toLocaleDateString("ar-TN")}</span>
                                            )}
                                        </div>
                                    )}

                                    {animal.notes && (
                                        <p className="livestock-card-notes">{animal.notes}</p>
                                    )}
                                </div>
                            );
                        })}

                        {filteredAnimals.length === 0 && (
                            <div className="crops-empty">
                                <span>🐑</span>
                                <p>لا توجد حيوانات مطابقة</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* === VACCINATIONS TAB === */}
            {view === "vaccinations" && (
                <div className="livestock-section">
                    {upcomingVaccinations.length > 0 && (
                        <div className="livestock-alert glass-card" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                            <span className="livestock-alert-icon">⚠️</span>
                            <div>
                                <strong>تطعيمات قادمة</strong>
                                <p>{upcomingVaccinations.length} تطعيم مستحق خلال 30 يوم</p>
                            </div>
                        </div>
                    )}

                    <div className="livestock-table-container glass-card">
                        <h3 className="livestock-section-title">💉 سجل التطعيمات</h3>
                        <table className="livestock-table">
                            <thead>
                                <tr>
                                    <th>الحيوان</th>
                                    <th>اللقاح</th>
                                    <th>التاريخ</th>
                                    <th>الموعد القادم</th>
                                    <th>الطبيب</th>
                                    <th>التكلفة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccinations.map((vax) => {
                                    const animal = animals.find((a) => a.id === vax.animal_id);
                                    const isDue = vax.next_due && new Date(vax.next_due) <= new Date();
                                    return (
                                        <tr key={vax.id} className={isDue ? "livestock-row-alert" : ""}>
                                            <td>{animal?.name || "—"} <span className="livestock-table-tag">{animal?.tag_number}</span></td>
                                            <td>{vax.vaccine_name}</td>
                                            <td>{new Date(vax.date).toLocaleDateString("ar-TN")}</td>
                                            <td>
                                                {vax.next_due ? (
                                                    <span className={isDue ? "livestock-overdue" : ""}>
                                                        {new Date(vax.next_due).toLocaleDateString("ar-TN")}
                                                        {isDue && " ⚠️"}
                                                    </span>
                                                ) : "—"}
                                            </td>
                                            <td>{vax.administered_by || "—"}</td>
                                            <td>{vax.cost ? formatCurrency(vax.cost) : "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* === FEED TAB === */}
            {view === "feed" && (
                <div className="livestock-section">
                    {lowFeed.length > 0 && (
                        <div className="livestock-alert glass-card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
                            <span className="livestock-alert-icon">🔴</span>
                            <div>
                                <strong>مخزون منخفض</strong>
                                <p>{lowFeed.length} أنواع علف أقل من 30%</p>
                            </div>
                        </div>
                    )}

                    <div className="livestock-feed-grid">
                        {feed.map((feedItem) => {
                            const percent = Math.round((feedItem.remaining_kg / feedItem.quantity_kg) * 100);
                            const isLow = percent < 30;
                            const barColor = isLow ? "#ef4444" : percent < 60 ? "#f59e0b" : "#10b981";

                            return (
                                <div key={feedItem.id} className="livestock-feed-card glass-card">
                                    <div className="livestock-feed-header">
                                        <h4 className="livestock-feed-name">🌾 {feedItem.feed_type}</h4>
                                        <span className="livestock-feed-cost">{formatCurrency(feedItem.quantity_kg * feedItem.cost_per_kg)}</span>
                                    </div>

                                    <div className="livestock-feed-bar-area">
                                        <div className="livestock-feed-bar-header">
                                            <span>المخزون المتبقي</span>
                                            <span style={{ color: barColor, fontWeight: 700 }}>{feedItem.remaining_kg} كغ / {feedItem.quantity_kg} كغ</span>
                                        </div>
                                        <div className="livestock-feed-bar">
                                            <div className="livestock-feed-bar-fill" style={{ width: `${percent}%`, background: barColor }} />
                                        </div>
                                        <span className="livestock-feed-percent" style={{ color: barColor }}>{percent}%</span>
                                    </div>

                                    <div className="livestock-feed-meta">
                                        <span>📅 شراء: {new Date(feedItem.purchase_date).toLocaleDateString("ar-TN")}</span>
                                        <span>💰 {feedItem.cost_per_kg} د.ت/كغ</span>
                                    </div>
                                    {feedItem.notes && <p className="livestock-card-notes">{feedItem.notes}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showModal && <LivestockModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); }} />}
        </>
    );
}
