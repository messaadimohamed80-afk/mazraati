"use client";

import { useState, useMemo, useEffect } from "react";
import InventoryModal from "@/components/InventoryModal";
import {
    INVENTORY_CATEGORY_MAP,
    INVENTORY_CONDITION_MAP,
} from "@/lib/mock-inventory-data";
import { formatCurrency } from "@/lib/utils";
import { InventoryItem } from "@/lib/types";
import { getInventory } from "@/lib/actions/inventory";

type CategoryFilter = "all" | "equipment" | "chemicals" | "seeds" | "tools" | "supplies" | "spare_parts";
type ViewMode = "items" | "maintenance";

export default function InventoryPage() {
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
    const [view, setView] = useState<ViewMode>("items");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getInventory().then(setInventory).catch(console.error).finally(() => setLoading(false));
    }, []);

    const totalItems = inventory.length;
    const totalValue = inventory.reduce((s, i) => s + i.purchase_price, 0);
    const lowStockCount = inventory.filter((i) => i.quantity < i.min_stock).length;
    const needsRepairCount = inventory.filter((i) => i.condition === "needs_repair" || i.condition === "broken").length;

    const categoryStats = Object.entries(INVENTORY_CATEGORY_MAP).map(([key, info]) => ({
        key,
        ...info,
        count: inventory.filter((i) => i.category === key).length,
        value: inventory.filter((i) => i.category === key).reduce((s, i) => s + i.purchase_price, 0),
    }));

    const filteredItems = useMemo(() => {
        return inventory.filter((item) => {
            if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
            if (search && !item.name.includes(search) && !item.notes?.includes(search)) return false;
            return true;
        });
    }, [categoryFilter, search, inventory]);

    const maintenanceItems = inventory.filter(
        (i) => i.last_maintenance || i.next_maintenance || i.condition === "needs_repair"
    );

    const filterTabs: { key: CategoryFilter; label: string; icon: string; count: number }[] = [
        { key: "all", label: "الكل", icon: "📋", count: totalItems },
        ...categoryStats.map((c) => ({ key: c.key as CategoryFilter, label: c.label, icon: c.icon, count: c.count })),
    ];

    const viewTabs: { key: ViewMode; label: string; icon: string }[] = [
        { key: "items", label: "المخزون", icon: "📦" },
        { key: "maintenance", label: "الصيانة", icon: "🔧" },
    ];

    if (loading) {
        return (
            <div className="page-loading"><span className="page-loading-spinner" />جاري التحميل...</div>
        );
    }

    return (
        <>

            {/* Page header */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">📦 إدارة المخزون</h1>
                    <p className="page-subtitle">المعدات والمواد والمستلزمات الزراعية</p>
                </div>
                <button className="modal-btn modal-btn-save" onClick={() => setShowModal(true)}>+ إضافة عنصر</button>
            </div>

            {/* Stats */}
            <div className="water-stats-grid">
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(236,72,153,0.12)", color: "#ec4899" }}>📦</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{totalItems}</span>
                        <span className="water-stat-label">عنصر في المخزون</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>💰</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{formatCurrency(totalValue)}</span>
                        <span className="water-stat-label">القيمة الإجمالية</span>
                    </div>
                </div>
                {lowStockCount > 0 && (
                    <div className="water-stat-card" style={{ border: "1px solid rgba(245,158,11,0.3)" }}>
                        <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>⚠️</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value" style={{ color: "#f59e0b" }}>{lowStockCount}</span>
                            <span className="water-stat-label">مخزون منخفض</span>
                        </div>
                    </div>
                )}
                {needsRepairCount > 0 && (
                    <div className="water-stat-card" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                        <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>🔧</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value" style={{ color: "#ef4444" }}>{needsRepairCount}</span>
                            <span className="water-stat-label">يحتاج إصلاح</span>
                        </div>
                    </div>
                )}
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>🏗️</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{categoryStats.length}</span>
                        <span className="water-stat-label">أصناف</span>
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

            {/* === ITEMS TAB === */}
            {view === "items" && (
                <>
                    {/* Category filters + search */}
                    <div className="crops-toolbar">
                        <div className="crops-filters">
                            {filterTabs.map((t) => (
                                <button
                                    key={t.key}
                                    className={`crops-filter-btn ${categoryFilter === t.key ? "crops-filter-active" : ""}`}
                                    onClick={() => setCategoryFilter(t.key)}
                                >
                                    {t.icon} {t.label} <span className="crops-filter-count">{t.count}</span>
                                </button>
                            ))}
                        </div>
                        <div className="crops-search">
                            <span>🔍</span>
                            <input
                                type="text"
                                placeholder="ابحث في المخزون..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="crops-search-input"
                            />
                        </div>
                    </div>

                    {/* Item cards */}
                    <div className="inventory-grid">
                        {filteredItems.map((item) => {
                            const catInfo = INVENTORY_CATEGORY_MAP[item.category];
                            const condInfo = INVENTORY_CONDITION_MAP[item.condition];
                            const stockPercent = Math.min(100, Math.round((item.quantity / Math.max(item.min_stock, 1)) * 100));
                            const isLow = item.quantity < item.min_stock;

                            return (
                                <div key={item.id} className="inventory-card glass-card">
                                    <div className="inventory-card-accent" style={{ background: catInfo.color }} />
                                    <div className="inventory-card-header">
                                        <div className="inventory-card-icon" style={{ background: `${catInfo.color}15`, color: catInfo.color }}>
                                            {catInfo.icon}
                                        </div>
                                        <div className="inventory-card-title-area">
                                            <h3 className="inventory-card-name">{item.name}</h3>
                                            <span className="inventory-card-category">{catInfo.label}</span>
                                        </div>
                                        <span
                                            className="inventory-status-badge"
                                            style={{ background: `${condInfo.color}15`, color: condInfo.color, borderColor: `${condInfo.color}30` }}
                                        >
                                            {condInfo.icon} {condInfo.label}
                                        </span>
                                    </div>

                                    <div className="inventory-card-details">
                                        <div className="inventory-detail">
                                            <span className="inventory-detail-label">الكمية</span>
                                            <span className="inventory-detail-value" style={isLow ? { color: "#ef4444" } : {}}>
                                                {item.quantity} {item.unit}
                                            </span>
                                        </div>
                                        <div className="inventory-detail">
                                            <span className="inventory-detail-label">الحد الأدنى</span>
                                            <span className="inventory-detail-value">{item.min_stock} {item.unit}</span>
                                        </div>
                                        <div className="inventory-detail">
                                            <span className="inventory-detail-label">الموقع</span>
                                            <span className="inventory-detail-value">{item.location}</span>
                                        </div>
                                        <div className="inventory-detail">
                                            <span className="inventory-detail-label">سعر الشراء</span>
                                            <span className="inventory-detail-value">{formatCurrency(item.purchase_price)}</span>
                                        </div>
                                    </div>

                                    {/* Stock level bar */}
                                    <div className="inventory-stock-area">
                                        <div className="inventory-stock-header">
                                            <span>مستوى المخزون</span>
                                            <span style={{ color: isLow ? "#ef4444" : "#10b981", fontWeight: 700 }}>{stockPercent}%</span>
                                        </div>
                                        <div className="inventory-stock-bar">
                                            <div
                                                className="inventory-stock-fill"
                                                style={{
                                                    width: `${stockPercent}%`,
                                                    background: isLow ? "#ef4444" : stockPercent < 80 ? "#f59e0b" : "#10b981",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {item.notes && <p className="inventory-card-notes">{item.notes}</p>}
                                </div>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <div className="crops-empty">
                                <span>📦</span>
                                <p>لا توجد عناصر مطابقة</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* === MAINTENANCE TAB === */}
            {view === "maintenance" && (
                <div className="inventory-maintenance-section glass-card">
                    <h3 className="inventory-maintenance-title">🔧 جدول الصيانة</h3>
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>المعدة</th>
                                <th>الفئة</th>
                                <th>الحالة</th>
                                <th>آخر صيانة</th>
                                <th>الصيانة القادمة</th>
                                <th>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceItems.map((item) => {
                                const catInfo = INVENTORY_CATEGORY_MAP[item.category];
                                const condInfo = INVENTORY_CONDITION_MAP[item.condition];
                                const isOverdue = item.next_maintenance && new Date(item.next_maintenance) <= new Date();

                                return (
                                    <tr key={item.id} className={item.condition === "needs_repair" ? "livestock-row-alert" : ""}>
                                        <td>{catInfo.icon} {item.name}</td>
                                        <td>{catInfo.label}</td>
                                        <td>
                                            <span style={{ color: condInfo.color, fontWeight: 600 }}>
                                                {condInfo.icon} {condInfo.label}
                                            </span>
                                        </td>
                                        <td>{item.last_maintenance ? new Date(item.last_maintenance).toLocaleDateString("ar-TN") : "—"}</td>
                                        <td>
                                            {item.next_maintenance ? (
                                                <span style={isOverdue ? { color: "#ef4444", fontWeight: 700 } : {}}>
                                                    {new Date(item.next_maintenance).toLocaleDateString("ar-TN")}
                                                    {isOverdue && " ⚠️"}
                                                </span>
                                            ) : "—"}
                                        </td>
                                        <td style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{item.notes || "—"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && <InventoryModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); }} />}
        </>
    );
}
