import { WaterTank } from "@/lib/types";
import { TANK_TYPE_MAP, TANK_STATUS_MAP } from "@/lib/mock/mock-water-data";

export function TanksTab({ tanks }: { tanks: WaterTank[] }) {
    return (
        <div className="water-content">
            <div className="water-cards-grid">
                {tanks.map((tank) => {
                    const typeInfo = TANK_TYPE_MAP[tank.type];
                    const statusInfo = TANK_STATUS_MAP[tank.status];
                    const levelColor =
                        tank.current_level_percent > 60
                            ? "#10b981"
                            : tank.current_level_percent > 25
                                ? "#f59e0b"
                                : "#ef4444";

                    return (
                        <div key={tank.id} className="water-card glass-card">
                            <div className="water-card-header">
                                <h3 className="water-card-name">{tank.name}</h3>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${statusInfo.color}18`, color: statusInfo.color, borderColor: `${statusInfo.color}40` }}
                                >
                                    {statusInfo.label}
                                </span>
                            </div>

                            {/* Tank level gauge */}
                            <div className="tank-gauge">
                                <div className="tank-gauge-container">
                                    <div
                                        className="tank-gauge-fill"
                                        style={{
                                            height: `${tank.current_level_percent}%`,
                                            background: `linear-gradient(to top, ${levelColor}dd, ${levelColor}88)`,
                                        }}
                                    />
                                    <div className="tank-gauge-label">
                                        <span className="tank-gauge-percent" style={{ color: levelColor }}>{tank.current_level_percent}%</span>
                                    </div>
                                </div>
                                <div className="tank-gauge-capacity">
                                    {(tank.capacity_liters / 1000).toFixed(0)} م³
                                </div>
                            </div>

                            <div className="water-card-details">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">النوع</span>
                                    <span className="water-detail-value">{typeInfo.icon} {typeInfo.label}</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">السعة</span>
                                    <span className="water-detail-value">{(tank.capacity_liters / 1000).toFixed(0)} م³</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">المصدر</span>
                                    <span className="water-detail-value">{tank.source}</span>
                                </div>
                                {tank.last_filled && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">آخر تعبئة</span>
                                        <span className="water-detail-value">
                                            {new Date(tank.last_filled).toLocaleDateString("ar-TN")}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {tank.notes && (
                                <div className="water-card-note">{tank.notes}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
