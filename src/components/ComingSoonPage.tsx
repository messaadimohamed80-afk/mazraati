import Link from "next/link";
import Footer from "./Footer";

interface ComingSoonPageProps {
    icon: string;
    title: string;
    description: string;
    features: string[];
    color: string;
    progress?: number;    // 0–100
    eta?: string;         // e.g. "الربع الثاني 2026"
}

export default function ComingSoonPage({
    icon,
    title,
    description,
    features,
    color,
    progress = 15,
    eta,
}: ComingSoonPageProps) {
    return (
        <>
            <div className="coming-soon-container">
                {/* Decorative background circles */}
                <div className="coming-soon-bg">
                    <div className="coming-soon-circle coming-soon-circle-1" style={{ borderColor: `${color}15` }} />
                    <div className="coming-soon-circle coming-soon-circle-2" style={{ borderColor: `${color}10` }} />
                    <div className="coming-soon-circle coming-soon-circle-3" style={{ background: `${color}06` }} />
                </div>

                <div className="coming-soon-card glass-card">
                    {/* Accent bar */}
                    <div className="coming-soon-accent" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />

                    {/* Icon */}
                    <div className="coming-soon-icon" style={{ background: `${color}15`, color, boxShadow: `0 0 40px ${color}20` }}>
                        {icon}
                    </div>

                    <h1 className="coming-soon-title">{title}</h1>
                    <p className="coming-soon-desc">{description}</p>

                    {/* Status badge */}
                    <div className="coming-soon-badge">
                        <span className="coming-soon-pulse" style={{ background: color }} />
                        <span>قيد التطوير</span>
                    </div>

                    {/* Progress bar */}
                    <div className="coming-soon-progress-section">
                        <div className="coming-soon-progress-header">
                            <span className="coming-soon-progress-label">نسبة الإنجاز</span>
                            <span className="coming-soon-progress-value" style={{ color }}>{progress}%</span>
                        </div>
                        <div className="coming-soon-progress-bar">
                            <div
                                className="coming-soon-progress-fill"
                                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
                            />
                        </div>
                        {eta && (
                            <span className="coming-soon-eta">
                                📅 الموعد المتوقع: {eta}
                            </span>
                        )}
                    </div>

                    {/* Features */}
                    <div className="coming-soon-features">
                        <h3>الميزات القادمة</h3>
                        <ul>
                            {features.map((f, i) => (
                                <li key={i} style={{ animationDelay: `${i * 0.1}s` }}>{f}</li>
                            ))}
                        </ul>
                    </div>

                    <Link href="/" className="coming-soon-back">
                        ← العودة للوحة التحكم
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
