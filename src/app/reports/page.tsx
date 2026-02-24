"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MOCK_EXPENSES, MOCK_CATEGORIES, formatCurrency } from "@/lib/mock-data";
import { MOCK_CROPS, MOCK_TASKS } from "@/lib/mock-crops-tasks-data";
import { MOCK_ANIMALS, MOCK_FEED } from "@/lib/mock-livestock-data";
import { MOCK_INVENTORY } from "@/lib/mock-inventory-data";
import { MOCK_WELLS } from "@/lib/mock-water-data";
import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals, getFeedRecords } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";
import { getWells } from "@/lib/actions/water";

/* Recharts loaded client-side only */
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false });

export default function ReportsPage() {
    const [expenses, setExpenses] = useState(MOCK_EXPENSES);
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [crops, setCrops] = useState(MOCK_CROPS);
    const [tasks, setTasks] = useState(MOCK_TASKS);
    const [animals, setAnimals] = useState(MOCK_ANIMALS);
    const [feed, setFeed] = useState(MOCK_FEED);
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [wells, setWells] = useState(MOCK_WELLS);

    useEffect(() => {
        getExpenses().then(setExpenses).catch(console.error);
        getCategories().then(setCategories).catch(console.error);
        getCrops().then(setCrops).catch(console.error);
        getTasks().then(setTasks).catch(console.error);
        getAnimals().then(setAnimals).catch(console.error);
        getFeedRecords().then(setFeed).catch(console.error);
        getInventory().then(setInventory).catch(console.error);
        getWells().then(setWells).catch(console.error);
    }, []);

    /* ===== Computed data ===== */
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const budget = 99000;
    const remaining = budget - totalExpenses;

    /* Category breakdown */
    const categoryData = useMemo(() => {
        return categories.map((cat) => ({
            name: cat.name,
            value: expenses.filter((e) => e.category_id === cat.id).reduce((s, e) => s + e.amount, 0),
            color: cat.color,
            icon: cat.icon,
        })).filter((c) => c.value > 0).sort((a, b) => b.value - a.value);
    }, [expenses, categories]);

    /* Monthly trend */
    const monthlyData = useMemo(() => {
        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const data = months.map((name, i) => ({
            name,
            amount: expenses.filter((e) => new Date(e.date).getMonth() === i).reduce((s, e) => s + e.amount, 0),
        }));
        return data.filter((d) => d.amount > 0);
    }, [expenses]);

    /* Pie chart for inventory categories */
    const inventoryCatData = useMemo(() => {
        const cats: Record<string, number> = {};
        inventory.forEach((i) => {
            const label = i.category;
            cats[label] = (cats[label] || 0) + i.purchase_price;
        });
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];
        return Object.entries(cats).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
    }, [inventory]);

    /* Farm stats */
    const activeAnimals = animals.filter((a) => a.status !== "sold" && a.status !== "deceased").length;
    const activeCrops = crops.filter((c) => c.status === "growing" || c.status === "planted").length;
    const pendingTasks = tasks.filter((t) => t.status !== "done").length;

    /* ===== Export functions ===== */
    const handlePrint = useCallback(() => { window.print(); }, []);

    const handleWhatsAppShare = useCallback(() => {
        const lines = [
            "📊 *تقرير مزرعتي*",
            `📅 ${new Date().toLocaleDateString("ar-SA")}`,
            "",
            `💰 الميزانية: ${formatCurrency(budget)}`,
            `📉 المصاريف: ${formatCurrency(totalExpenses)}`,
            `📊 المتبقي: ${formatCurrency(remaining)}`,
            `📋 نسبة الاستهلاك: ${Math.round((totalExpenses / budget) * 100)}%`,
            "",
            "🌾 *أصول المزرعة:*",
            `  💧 آبار: ${wells.length}`,
            `  🌾 محاصيل نشطة: ${activeCrops}`,
            `  🐑 رؤوس ماشية: ${activeAnimals}`,
            `  📦 عناصر مخزون: ${inventory.length}`,
            `  ✅ مهام قيد التنفيذ: ${pendingTasks}`,
            "",
            "— مزرعتي | إدارة المزرعة الذكية",
            "https://mazraati-three.vercel.app",
        ];
        const text = encodeURIComponent(lines.join("\n"));
        window.open(`https://wa.me/?text=${text}`, "_blank");
    }, [budget, totalExpenses, remaining, wells, activeCrops, activeAnimals, inventory, pendingTasks]);

    const handleExportCSV = useCallback(() => {
        const header = "الوصف,الفئة,المبلغ,التاريخ\n";
        const rows = expenses.map((e) => {
            const cat = categories.find((c) => c.id === e.category_id);
            return `"${e.description}","${cat?.name || ""}",${e.amount},"${e.date}"`;
        }).join("\n");
        const csv = "\uFEFF" + header + rows; // BOM for Arabic
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mazraati_expenses_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [expenses, categories]);

    const handleExportJSON = useCallback(() => {
        const data = {
            exported_at: new Date().toISOString(),
            budget,
            total_expenses: totalExpenses,
            remaining,
            expenses,
            crops,
            animals,
            inventory,
            tasks,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mazraati_report_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [totalExpenses, remaining, expenses, crops, animals, inventory, tasks]);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />

                {/* Page header */}
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">📊 التقارير والإحصائيات</h1>
                        <p className="page-subtitle">تقارير شاملة عن أداء المزرعة</p>
                    </div>
                </div>

                {/* KPI summary */}
                <div className="water-stats-grid">
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>💰</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{formatCurrency(budget)}</span>
                            <span className="water-stat-label">الميزانية</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>📉</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{formatCurrency(totalExpenses)}</span>
                            <span className="water-stat-label">إجمالي المصاريف</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>📊</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{formatCurrency(remaining)}</span>
                            <span className="water-stat-label">المتبقي</span>
                        </div>
                    </div>
                    <div className="water-stat-card">
                        <div className="water-stat-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>📋</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value">{Math.round((totalExpenses / budget) * 100)}%</span>
                            <span className="water-stat-label">نسبة الاستهلاك</span>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="reports-charts-row">
                    {/* Expense by Category - Bar Chart */}
                    <div className="reports-chart-card glass-card">
                        <h3 className="reports-chart-title">
                            <span className="section-title-dot" style={{ background: "#10b981" }} />
                            💰 توزيع المصاريف حسب الفئة
                        </h3>
                        <div className="reports-chart-container" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                                    <YAxis dataKey="name" type="category" tick={{ fill: "#e2e8f0", fontSize: 12 }} width={70} />
                                    <Tooltip
                                        contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }}
                                        formatter={(value) => [formatCurrency(Number(value)), "المبلغ"]}
                                    />
                                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Trend - Area Chart */}
                    <div className="reports-chart-card glass-card">
                        <h3 className="reports-chart-title">
                            <span className="section-title-dot" style={{ background: "#3b82f6" }} />
                            📈 اتجاه المصاريف الشهري
                        </h3>
                        <div className="reports-chart-container" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                                    <Tooltip
                                        contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }}
                                        formatter={(value) => [formatCurrency(Number(value)), "المبلغ"]}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Farm Assets + Inventory Pie */}
                <div className="reports-charts-row">
                    {/* Farm Assets Summary */}
                    <div className="reports-chart-card glass-card">
                        <h3 className="reports-chart-title">
                            <span className="section-title-dot" style={{ background: "#8b5cf6" }} />
                            🌾 ملخص أصول المزرعة
                        </h3>
                        <div className="reports-assets-grid">
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>💧</span>
                                <span className="reports-asset-value">{wells.length}</span>
                                <span className="reports-asset-label">آبار</span>
                            </div>
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>🌾</span>
                                <span className="reports-asset-value">{activeCrops}</span>
                                <span className="reports-asset-label">محاصيل نشطة</span>
                            </div>
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(139,92,246,0.12)", color: "#8b5cf6" }}>🐑</span>
                                <span className="reports-asset-value">{activeAnimals}</span>
                                <span className="reports-asset-label">رأس ماشية</span>
                            </div>
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(236,72,153,0.12)", color: "#ec4899" }}>📦</span>
                                <span className="reports-asset-value">{inventory.length}</span>
                                <span className="reports-asset-label">عنصر مخزون</span>
                            </div>
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✅</span>
                                <span className="reports-asset-value">{pendingTasks}</span>
                                <span className="reports-asset-label">مهمة قيد التنفيذ</span>
                            </div>
                            <div className="reports-asset-item">
                                <span className="reports-asset-icon" style={{ background: "rgba(249,115,22,0.12)", color: "#f97316" }}>🌾</span>
                                <span className="reports-asset-value">{feed.length}</span>
                                <span className="reports-asset-label">نوع أعلاف</span>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Value Pie */}
                    <div className="reports-chart-card glass-card">
                        <h3 className="reports-chart-title">
                            <span className="section-title-dot" style={{ background: "#ec4899" }} />
                            📦 قيمة المخزون حسب الصنف
                        </h3>
                        <div className="reports-chart-container" style={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={inventoryCatData}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {inventoryCatData.map((entry, index) => (
                                            <Cell key={`pie-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#e2e8f0" }}
                                        formatter={(value) => [formatCurrency(Number(value)), "القيمة"]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="reports-pie-legend">
                            {inventoryCatData.map((d) => (
                                <span key={d.name} className="reports-pie-legend-item">
                                    <span className="reports-pie-dot" style={{ background: d.color }} />
                                    {d.name}: {formatCurrency(d.value)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Export */}
                <div className="reports-export-card glass-card">
                    <h3 className="reports-chart-title">
                        <span className="section-title-dot" style={{ background: "#10b981" }} />
                        📤 تصدير التقرير
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                        صدّر بيانات المزرعة بالصيغة التي تناسبك
                    </p>
                    <div className="reports-export-section">
                        <button className="reports-export-btn" onClick={handlePrint}>🖨️ طباعة</button>
                        <button className="reports-export-btn" onClick={handleExportCSV}>📊 تصدير CSV</button>
                        <button className="reports-export-btn" onClick={handleExportJSON}>📄 تصدير JSON</button>
                        <button className="reports-export-btn reports-whatsapp-btn" onClick={handleWhatsAppShare}>📱 مشاركة عبر واتساب</button>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
