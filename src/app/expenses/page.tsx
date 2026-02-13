"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ExpenseModal from "@/components/ExpenseModal";
import { MOCK_EXPENSES, MOCK_CATEGORIES, formatCurrency, formatDate } from "@/lib/mock-data";
import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { Expense, Category } from "@/lib/types";
import Footer from "@/components/Footer";

type SortKey = "date" | "amount" | "category";
type SortDir = "asc" | "desc";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [dateRange, setDateRange] = useState("all");

    useEffect(() => {
        getExpenses().then(setExpenses).catch(console.error);
        getCategories().then(setCategories).catch(console.error);
    }, []);

    // ===== Computed =====
    const filteredExpenses = useMemo(() => {
        let result = [...expenses];

        // Filter by search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (e) =>
                    e.description.toLowerCase().includes(q) ||
                    e.notes?.toLowerCase().includes(q) ||
                    e.category?.name.toLowerCase().includes(q)
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter((e) => e.category_id === selectedCategory);
        }

        // Filter by date range
        if (dateRange !== "all") {
            const now = new Date();
            let cutoff = new Date();
            if (dateRange === "7d") cutoff.setDate(now.getDate() - 7);
            else if (dateRange === "30d") cutoff.setDate(now.getDate() - 30);
            else if (dateRange === "90d") cutoff.setDate(now.getDate() - 90);
            else if (dateRange === "year") cutoff = new Date(now.getFullYear(), 0, 1);
            result = result.filter((e) => new Date(e.date) >= cutoff);
        }

        // Sort
        result.sort((a, b) => {
            let cmp = 0;
            if (sortKey === "date") cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
            else if (sortKey === "amount") cmp = a.amount - b.amount;
            else if (sortKey === "category") cmp = (a.category?.name || "").localeCompare(b.category?.name || "");
            return sortDir === "desc" ? -cmp : cmp;
        });

        return result;
    }, [expenses, searchQuery, selectedCategory, sortKey, sortDir, dateRange]);

    // ===== Stats =====
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
    const categoryBreakdown = useMemo(() => {
        const map = new Map<string, { category: typeof MOCK_CATEGORIES[0]; total: number; count: number }>();
        expenses.forEach((e) => {
            const cat = e.category || MOCK_CATEGORIES.find((c) => c.id === e.category_id);
            if (!cat) return;
            const existing = map.get(cat.id);
            if (existing) {
                existing.total += e.amount;
                existing.count += 1;
            } else {
                map.set(cat.id, { category: cat, total: e.amount, count: 1 });
            }
        });
        return Array.from(map.values()).sort((a, b) => b.total - a.total);
    }, [expenses]);

    const topCategory = categoryBreakdown[0];

    // ===== Handlers =====
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const handleAddExpense = (expense: Omit<Expense, "id" | "created_at" | "created_by" | "farm_id">) => {
        const newExpense: Expense = {
            ...expense,
            id: `exp-${Date.now()}`,
            farm_id: "farm-1",
            created_by: "user-1",
            created_at: new Date().toISOString(),
            category: MOCK_CATEGORIES.find((c) => c.id === expense.category_id),
        };
        setExpenses((prev) => [newExpense, ...prev]);
        setShowModal(false);
    };

    const handleEditExpense = (expense: Omit<Expense, "id" | "created_at" | "created_by" | "farm_id">) => {
        if (!editingExpense) return;
        setExpenses((prev) =>
            prev.map((e) =>
                e.id === editingExpense.id
                    ? {
                        ...e,
                        ...expense,
                        category: MOCK_CATEGORIES.find((c) => c.id === expense.category_id),
                    }
                    : e
            )
        );
        setEditingExpense(null);
        setShowModal(false);
    };

    const handleDeleteExpense = (id: string) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    };

    const openEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setShowModal(true);
    };

    const openAdd = () => {
        setEditingExpense(null);
        setShowModal(true);
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Header />

                {/* Page Header */}
                <section className="page-header">
                    <div className="page-header-text">
                        <h2 className="page-title">
                            <span className="page-title-icon" style={{ background: "rgba(16, 185, 129, 0.12)" }}>💰</span>
                            المحاسبة والمصاريف
                        </h2>
                        <p className="page-subtitle">تتبع وإدارة جميع مصاريف المزرعة</p>
                    </div>
                    <button className="btn-primary" onClick={openAdd}>
                        <span>➕</span>
                        <span>إضافة مصروف</span>
                    </button>
                </section>

                {/* Date Range Filter */}
                <div className="date-filter-row">
                    {(["all", "7d", "30d", "90d", "year"] as const).map((range) => {
                        const labels: Record<string, string> = { all: "الكل", "7d": "7 أيام", "30d": "30 يوم", "90d": "90 يوم", year: "هذا العام" };
                        return (
                            <button key={range} className={`date-filter-btn ${dateRange === range ? "date-filter-active" : ""}`} onClick={() => setDateRange(range)}>
                                {labels[range]}
                            </button>
                        );
                    })}
                </div>

                {/* Stats Cards */}
                <section className="dashboard-section">
                    <div className="expense-stats-grid">
                        <div className="expense-stat-card glass-card">
                            <div className="expense-stat-icon" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>💰</div>
                            <div>
                                <div className="expense-stat-value" style={{ color: "#10b981" }}>
                                    {formatCurrency(totalExpenses)}
                                </div>
                                <div className="expense-stat-label">إجمالي المصاريف</div>
                            </div>
                        </div>
                        <div className="expense-stat-card glass-card">
                            <div className="expense-stat-icon" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>📊</div>
                            <div>
                                <div className="expense-stat-value" style={{ color: "#3b82f6" }}>
                                    {formatCurrency(Math.round(avgExpense))}
                                </div>
                                <div className="expense-stat-label">متوسط المصروف</div>
                            </div>
                        </div>
                        <div className="expense-stat-card glass-card">
                            <div className="expense-stat-icon" style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }}>📋</div>
                            <div>
                                <div className="expense-stat-value" style={{ color: "#f59e0b" }}>
                                    {expenses.length}
                                </div>
                                <div className="expense-stat-label">عدد المعاملات</div>
                            </div>
                        </div>
                        <div className="expense-stat-card glass-card">
                            <div className="expense-stat-icon" style={{ background: `${topCategory?.category.color}20`, color: topCategory?.category.color }}>
                                {topCategory?.category.icon}
                            </div>
                            <div>
                                <div className="expense-stat-value" style={{ color: topCategory?.category.color }}>
                                    {topCategory?.category.name}
                                </div>
                                <div className="expense-stat-label">أعلى تصنيف إنفاقاً</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Category Breakdown Bar */}
                <section className="dashboard-section">
                    <div className="category-bar-container glass-card">
                        <h3 className="category-bar-title">توزيع المصاريف حسب التصنيف</h3>
                        <div className="category-bar">
                            {categoryBreakdown.map(({ category, total }) => (
                                <div
                                    key={category.id}
                                    className="category-bar-segment"
                                    style={{
                                        width: `${(total / totalExpenses) * 100}%`,
                                        background: category.color,
                                    }}
                                    title={`${category.name}: ${formatCurrency(total)}`}
                                />
                            ))}
                        </div>
                        <div className="category-legend">
                            {categoryBreakdown.map(({ category, total, count }) => (
                                <div key={category.id} className="category-legend-item">
                                    <span className="category-legend-dot" style={{ background: category.color }} />
                                    <span className="category-legend-name">{category.icon} {category.name}</span>
                                    <span className="category-legend-amount">{formatCurrency(total)}</span>
                                    <span className="category-legend-count">({count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Filters + Table */}
                <section className="dashboard-section">
                    <div className="expense-table-container glass-card">
                        {/* Filters */}
                        <div className="expense-filters">
                            <div className="expense-search">
                                <span className="expense-search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="ابحث في المصاريف..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="expense-search-input"
                                />
                            </div>
                            <div className="expense-filter-group">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="expense-filter-select"
                                >
                                    <option value="all">كل التصنيفات</option>
                                    {MOCK_CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="expense-table-wrapper">
                            <table className="expense-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort("date")} className="expense-th-sortable">
                                            التاريخ {sortKey === "date" && (sortDir === "desc" ? "↓" : "↑")}
                                        </th>
                                        <th>التصنيف</th>
                                        <th>الوصف</th>
                                        <th onClick={() => handleSort("amount")} className="expense-th-sortable">
                                            المبلغ {sortKey === "amount" && (sortDir === "desc" ? "↓" : "↑")}
                                        </th>
                                        <th>ملاحظات</th>
                                        <th>إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="expense-empty">
                                                <div className="expense-empty-content">
                                                    <span className="expense-empty-icon">📭</span>
                                                    <p>لا توجد مصاريف مطابقة</p>
                                                    <button className="btn-primary btn-sm" onClick={openAdd}>
                                                        إضافة أول مصروف
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredExpenses.map((expense) => (
                                            <tr key={expense.id} className="expense-row">
                                                <td className="expense-date">{formatDate(expense.date)}</td>
                                                <td>
                                                    <span
                                                        className="expense-category-badge"
                                                        style={{
                                                            background: `${expense.category?.color}18`,
                                                            color: expense.category?.color,
                                                            borderColor: `${expense.category?.color}40`,
                                                        }}
                                                    >
                                                        {expense.category?.icon} {expense.category?.name}
                                                    </span>
                                                </td>
                                                <td className="expense-desc">{expense.description}</td>
                                                <td className="expense-amount">{formatCurrency(expense.amount, expense.currency)}</td>
                                                <td className="expense-notes">{expense.notes || "—"}</td>
                                                <td className="expense-actions">
                                                    <button
                                                        className="expense-action-btn"
                                                        onClick={() => openEdit(expense)}
                                                        title="تعديل"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="expense-action-btn expense-action-delete"
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        title="حذف"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table footer */}
                        <div className="expense-table-footer">
                            <span className="expense-count-label">
                                عرض {filteredExpenses.length} من {expenses.length} معاملة
                            </span>
                            <span className="expense-total-label">
                                الإجمالي: <strong>{formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</strong>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />

                {/* Add/Edit Modal */}
                {showModal && (
                    <ExpenseModal
                        expense={editingExpense}
                        categories={MOCK_CATEGORIES}
                        onSave={editingExpense ? handleEditExpense : handleAddExpense}
                        onClose={() => {
                            setShowModal(false);
                            setEditingExpense(null);
                        }}
                    />
                )}
            </main>
        </div>
    );
}
