import Link from "next/link";

interface ModuleCardProps {
    icon: string;
    title: string;
    desc: string;
    count: string;
    color: string;
    href: string;
    progress: number;
    comingSoon?: boolean;
}

export default function ModuleCard({
    icon,
    title,
    desc,
    count,
    color,
    href,
    progress,
    comingSoon,
}: ModuleCardProps) {
    return (
        <Link
            href={href}
            prefetch={false}
            className={`module-card glass-card ${comingSoon ? "module-coming-soon" : ""}`}
            style={{ textDecoration: "none" }}
        >
            <div className="module-top-bar" style={{ background: color }} />
            <div className="module-card-body">
                <div className="module-card-header">
                    <span
                        className="module-card-icon"
                        style={{ background: `${color}20`, borderColor: `${color}40` }}
                    >
                        {icon}
                    </span>
                    <span className="module-card-count" style={{ color }}>
                        {count}
                    </span>
                </div>
                <h3 className="module-card-title">{title}</h3>
                <p className="module-card-desc">{desc}</p>
                <div className="module-progress">
                    <div className="module-progress-track">
                        <div
                            className="module-progress-fill"
                            style={{ width: `${progress}%`, background: color }}
                        />
                    </div>
                    {comingSoon ? (
                        <span className="module-coming-badge">قريباً</span>
                    ) : (
                        <span className="module-progress-text" style={{ color }}>
                            {progress}%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
