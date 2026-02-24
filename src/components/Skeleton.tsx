"use client";

/**
 * Skeleton — Shimmer loading placeholder
 * Usage:
 *   <Skeleton variant="text" width="60%" />
 *   <Skeleton variant="card" />
 *   <Skeleton variant="circle" size={48} />
 *   <Skeleton variant="rect" width={200} height={120} />
 */

interface SkeletonProps {
    variant?: "text" | "card" | "circle" | "rect" | "table-row";
    width?: string | number;
    height?: string | number;
    size?: number;
    lines?: number;
    className?: string;
}

export default function Skeleton({
    variant = "text",
    width,
    height,
    size,
    lines = 1,
    className = "",
}: SkeletonProps) {
    if (variant === "card") {
        return (
            <div className={`skeleton skeleton-card ${className}`}>
                <div className="skeleton-shimmer" style={{ height: height || 180 }} />
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div className="skeleton-shimmer skeleton-text" style={{ width: "60%" }} />
                    <div className="skeleton-shimmer skeleton-text" style={{ width: "80%" }} />
                    <div className="skeleton-shimmer skeleton-text" style={{ width: "40%" }} />
                </div>
            </div>
        );
    }

    if (variant === "circle") {
        const s = size || 48;
        return (
            <div
                className={`skeleton-shimmer ${className}`}
                style={{ width: s, height: s, borderRadius: "50%", flexShrink: 0 }}
            />
        );
    }

    if (variant === "rect") {
        return (
            <div
                className={`skeleton-shimmer ${className}`}
                style={{ width: width || "100%", height: height || 120, borderRadius: "var(--radius-md)" }}
            />
        );
    }

    if (variant === "table-row") {
        return (
            <div className={`skeleton-table-row ${className}`}>
                <div className="skeleton-shimmer" style={{ width: "15%", height: 16 }} />
                <div className="skeleton-shimmer" style={{ width: "25%", height: 16 }} />
                <div className="skeleton-shimmer" style={{ width: "20%", height: 16 }} />
                <div className="skeleton-shimmer" style={{ width: "15%", height: 16 }} />
                <div className="skeleton-shimmer" style={{ width: "10%", height: 16 }} />
            </div>
        );
    }

    // Default: text lines
    return (
        <div className={`skeleton-text-group ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton-shimmer skeleton-text"
                    style={{
                        width: width || (i === lines - 1 && lines > 1 ? "60%" : "100%"),
                        height: height || 16,
                    }}
                />
            ))}
        </div>
    );
}

/* ===== Preset Layout Skeletons ===== */

export function DashboardSkeleton() {
    return (
        <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Welcome banner skeleton */}
            <Skeleton variant="rect" height={140} />

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} variant="rect" height={100} />
                ))}
            </div>

            {/* Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem" }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} variant="rect" height={80} />
                ))}
            </div>

            {/* Module cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} variant="rect" height={160} />
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem" }}>
            <Skeleton variant="rect" height={40} />
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} variant="table-row" />
            ))}
        </div>
    );
}

export function CardGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "1rem", padding: "1rem" }}>
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} variant="rect" height={180} />
            ))}
        </div>
    );
}
