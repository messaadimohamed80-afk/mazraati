"use client";

import { useState, useMemo, useEffect } from "react";
import {
    TASK_PRIORITY_MAP,
    TASK_STATUS_MAP,
    isOverdue,
    getDaysUntil,
} from "@/lib/mock/mock-crops-tasks-data";
import { Task } from "@/lib/types";
import { useTasks } from "@/hooks/useTasks";

type TaskFilter = "all" | "pending" | "in_progress" | "done" | "overdue";

export default function ClientTasks({
    initialTasks
}: {
    initialTasks: Task[];
}) {
    const { tasks } = useTasks(initialTasks);
    const [filter, setFilter] = useState<TaskFilter>("all");
    const [search, setSearch] = useState("");

    const overdueTasks = tasks.filter((t) => t.status !== "done" && isOverdue(t.due_date));

    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            if (filter === "overdue") return t.status !== "done" && isOverdue(t.due_date);
            if (filter !== "all" && t.status !== filter) return false;
            if (search && !t.title.includes(search) && !t.description?.includes(search)) return false;
            return true;
        });
    }, [filter, search, tasks]);

    /* Stats */
    const pendingCount = tasks.filter((t) => t.status === "pending").length;
    const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
    const doneCount = tasks.filter((t) => t.status === "done").length;
    const urgentCount = tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length;

    const statusFilters: { key: TaskFilter; label: string; count: number; icon: string }[] = [
        { key: "all", label: "الكل", count: tasks.length, icon: "📋" },
        { key: "pending", label: "قيد الانتظار", count: pendingCount, icon: "⏳" },
        { key: "in_progress", label: "جاري", count: inProgressCount, icon: "🔄" },
        { key: "done", label: "مكتمل", count: doneCount, icon: "✅" },
        { key: "overdue", label: "متأخرة", count: overdueTasks.length, icon: "⚠️" },
    ];



    return (
        <>

            {/* Page header */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">✅ إدارة المهام</h1>
                    <p className="page-subtitle">تنظيم ومتابعة مهام المزرعة</p>
                </div>
            </div>

            {/* Stats */}
            <div className="water-stats-grid">
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>📋</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{tasks.length}</span>
                        <span className="water-stat-label">إجمالي المهام</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>⏳</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{pendingCount + inProgressCount}</span>
                        <span className="water-stat-label">مهام نشطة</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>✅</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{doneCount}</span>
                        <span className="water-stat-label">مكتملة</span>
                    </div>
                </div>
                <div className="water-stat-card">
                    <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>🔴</div>
                    <div className="water-stat-info">
                        <span className="water-stat-value">{urgentCount}</span>
                        <span className="water-stat-label">عاجلة</span>
                    </div>
                </div>
                {overdueTasks.length > 0 && (
                    <div className="water-stat-card" style={{ border: "1px solid rgba(239,68,68,0.3)" }}>
                        <div className="water-stat-icon" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>⚠️</div>
                        <div className="water-stat-info">
                            <span className="water-stat-value" style={{ color: "#ef4444" }}>{overdueTasks.length}</span>
                            <span className="water-stat-label">متأخرة</span>
                        </div>
                    </div>
                )}
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
                            {f.icon} {f.label} <span className="crops-filter-count">{f.count}</span>
                        </button>
                    ))}
                </div>
                <div className="crops-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="ابحث عن مهمة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="crops-search-input"
                    />
                </div>
            </div>

            {/* Task list */}
            <div className="tasks-list">
                {filtered.map((task) => {
                    const priority = TASK_PRIORITY_MAP[task.priority];
                    const statusInfo = TASK_STATUS_MAP[task.status];
                    const overdue = task.status !== "done" && isOverdue(task.due_date);
                    const daysLeft = task.due_date ? getDaysUntil(task.due_date) : null;

                    return (
                        <div
                            key={task.id}
                            className={`task-card glass-card ${task.status === "done" ? "task-done" : ""} ${overdue ? "task-overdue" : ""}`}
                        >
                            {/* Priority stripe */}
                            <div className="task-priority-stripe" style={{ background: priority.color }} />

                            <div className="task-card-body">
                                {/* Top row */}
                                <div className="task-card-top">
                                    <div className="task-card-title-area">
                                        <div className="task-checkbox" style={{ borderColor: statusInfo.color, background: task.status === "done" ? statusInfo.color : "transparent" }}>
                                            {task.status === "done" && "✓"}
                                        </div>
                                        <h3 className={`task-card-title ${task.status === "done" ? "task-title-done" : ""}`}>
                                            {task.title}
                                        </h3>
                                    </div>
                                    <div className="task-card-badges">
                                        <span
                                            className="task-priority-badge"
                                            style={{ background: `${priority.color}18`, color: priority.color, borderColor: `${priority.color}40` }}
                                        >
                                            {priority.icon} {priority.label}
                                        </span>
                                        <span
                                            className="task-status-badge"
                                            style={{ background: `${statusInfo.color}18`, color: statusInfo.color }}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                {task.description && (
                                    <p className="task-description">{task.description}</p>
                                )}

                                {/* Meta row */}
                                <div className="task-meta">
                                    {task.assigned_to && (
                                        <span className="task-meta-item">
                                            👤 {task.assigned_to}
                                        </span>
                                    )}
                                    {task.due_date && (
                                        <span className={`task-meta-item ${overdue ? "task-meta-overdue" : ""}`}>
                                            📅 {new Date(task.due_date).toLocaleDateString("ar-TN")}
                                            {daysLeft !== null && !overdue && task.status !== "done" && (
                                                <span className="task-days-badge">
                                                    {daysLeft === 0 ? "اليوم" : daysLeft === 1 ? "غداً" : `${daysLeft} يوم`}
                                                </span>
                                            )}
                                            {overdue && <span className="task-overdue-badge">متأخرة!</span>}
                                        </span>
                                    )}
                                    {task.recurring && (
                                        <span className="task-meta-item task-meta-recurring">
                                            🔄 {task.recurrence_rule || "متكررة"}
                                        </span>
                                    )}
                                    {task.completed_at && (
                                        <span className="task-meta-item" style={{ color: "#10b981" }}>
                                            ✅ {new Date(task.completed_at).toLocaleDateString("ar-TN")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="crops-empty">
                        <span>✅</span>
                        <p>لا توجد مهام مطابقة</p>
                    </div>
                )}
            </div>

        </>
    );
}
