import { CardGridSkeleton } from "@/components/Skeleton";

export default function InventoryLoading() {
    return (
        <div className="dashboard-section" style={{ padding: "1.5rem" }}>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">📦 إدارة المخزون</h1>
                </div>
            </div>
            <div className="water-stats-grid">
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ marginTop: "1.5rem" }}>
                <CardGridSkeleton count={8} columns={4} />
            </div>
        </div>
    );
}
