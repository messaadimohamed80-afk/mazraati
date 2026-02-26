import { TableSkeleton } from "@/components/Skeleton";

export default function ExpensesLoading() {
    return (
        <div className="dashboard-section" style={{ padding: "1.5rem" }}>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">💸 إدارة المصاريف</h1>
                </div>
            </div>
            <div className="water-stats-grid">
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
            </div>
            <div className="glass-card" style={{ marginTop: "1.5rem" }}>
                <TableSkeleton rows={8} />
            </div>
        </div>
    );
}
