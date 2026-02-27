/* Loading skeleton for reports page */

export default function ReportsLoading() {
    return (
        <div className="dashboard-section" style={{ padding: "1.5rem" }}>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">📊 التقارير والإحصائيات</h1>
                </div>
            </div>
            <div className="water-stats-grid">
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 100, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="skeleton-shimmer" style={{ height: 350, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 350, borderRadius: "var(--radius-md)" }} />
            </div>
            <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="skeleton-shimmer" style={{ height: 350, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 350, borderRadius: "var(--radius-md)" }} />
            </div>
        </div>
    );
}
