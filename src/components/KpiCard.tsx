interface KpiCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
    trend?: {
        value: string;
        direction: "up" | "down" | "neutral";
    };
    color?: string;
}

export default function KpiCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color = "#10b981",
}: KpiCardProps) {
    const trendColor =
        trend?.direction === "up"
            ? "var(--success)"
            : trend?.direction === "down"
                ? "var(--danger)"
                : "var(--text-muted)";

    const trendIcon =
        trend?.direction === "up" ? "↑" : trend?.direction === "down" ? "↓" : "•";

    return (
        <div className="kpi-card" style={{ "--kpi-color": color } as React.CSSProperties}>
            {/* Colored accent line */}
            <div className="kpi-accent" style={{ background: color }} />
            <div className="kpi-body">
                <div className="kpi-header">
                    <span
                        className="kpi-icon-wrapper"
                        style={{
                            background: `${color}15`,
                            border: `1px solid ${color}30`,
                            color: color,
                        }}
                    >
                        {icon}
                    </span>
                    <span className="kpi-title">{title}</span>
                </div>
                <div className="kpi-value">{value}</div>
                {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
                {trend && (
                    <div className="kpi-trend" style={{ color: trendColor }}>
                        <span className="kpi-trend-icon">{trendIcon}</span>
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
            {/* Background glow */}
            <div
                className="kpi-glow"
                style={{
                    background: `radial-gradient(circle at top right, ${color}08 0%, transparent 60%)`,
                }}
            />
        </div>
    );
}
