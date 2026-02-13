interface WellStatusCardProps {
    depth: number;
    waterLevel: number;
    waterQuality: string;
    totalCost: string;
    status: string;
}

export default function WellStatusCard({
    depth,
    waterLevel,
    waterQuality,
    totalCost,
    status,
}: WellStatusCardProps) {
    const waterPercent = Math.round((waterLevel / depth) * 100);

    return (
        <div className="well-status-card glass-card">
            <div className="well-visual">
                <div className="well-shaft">
                    <div className="well-water" style={{ height: `${waterPercent}%` }}>
                        <div className="well-water-surface" />
                    </div>
                    <div className="well-depth-marks">
                        <span>0م</span>
                        <span>{Math.round(depth * 0.33)}م</span>
                        <span>{Math.round(depth * 0.66)}م</span>
                        <span>{depth}م</span>
                    </div>
                </div>
            </div>
            <div className="well-info">
                <div className="well-info-row">
                    <span className="well-info-label">العمق الكلي</span>
                    <span className="well-info-value">{depth} متر</span>
                </div>
                <div className="well-info-row">
                    <span className="well-info-label">مستوى المياه</span>
                    <span className="well-info-value cyan">{waterLevel} متر</span>
                </div>
                <div className="well-info-row">
                    <span className="well-info-label">نوعية المياه</span>
                    <span className="well-info-value success">{waterQuality} ✓</span>
                </div>
                <div className="well-info-row">
                    <span className="well-info-label">التكلفة</span>
                    <span className="well-info-value">{totalCost}</span>
                </div>
                <div className="well-info-row">
                    <span className="well-info-label">الحالة</span>
                    <span className="well-status-badge">{status}</span>
                </div>
            </div>
        </div>
    );
}
