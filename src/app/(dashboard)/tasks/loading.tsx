import { CardGridSkeleton } from "@/components/Skeleton";

export default function TasksLoading() {
    return (
        <div className="dashboard-section" style={{ padding: "1.5rem" }}>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">✅ إدارة المهام</h1>
                </div>
            </div>
            <div className="water-stats-grid">
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ padding: "1.5rem" }}>
                <div className="skeleton-shimmer" style={{ height: 80, borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                <div className="skeleton-shimmer" style={{ height: 80, borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                <div className="skeleton-shimmer" style={{ height: 80, borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                <div className="skeleton-shimmer" style={{ height: 80, borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                <div className="skeleton-shimmer" style={{ height: 80, borderRadius: "var(--radius-md)" }} />
            </div>
        </div>
    );
}
