export default function SettingsLoading() {
    return (
        <div className="dashboard-section" style={{ padding: "1.5rem" }}>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">⚙️ الإعدادات</h1>
                </div>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="skeleton-shimmer" style={{ height: 120, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 120, borderRadius: "var(--radius-md)" }} />
                <div className="skeleton-shimmer" style={{ height: 120, borderRadius: "var(--radius-md)" }} />
            </div>
        </div>
    );
}
