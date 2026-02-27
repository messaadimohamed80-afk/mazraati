import { SolarPanel } from "@/lib/types";
import { SOLAR_STATUS_MAP } from "@/lib/mock/mock-energy-data";
import { formatCurrency } from "@/lib/utils";

export function SolarTab({ solar, totalSolarKw, dailyProduction, solarInvestment }: { solar: SolarPanel[], totalSolarKw: number, dailyProduction: number, solarInvestment: number }) {
    return (
        <div className="water-content">
            <div className="water-cards-grid">
                {solar.map((panel) => {
                    const status = SOLAR_STATUS_MAP[panel.status];
                    const effColor =
                        panel.efficiency_percent > 75 ? "#10b981"
                            : panel.efficiency_percent > 50 ? "#f59e0b"
                                : "#ef4444";

                    return (
                        <div key={panel.id} className="water-card glass-card">
                            <div className="water-card-header">
                                <h3 className="water-card-name">{panel.name}</h3>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                >
                                    {status.icon} {status.label}
                                </span>
                            </div>

                            {/* Solar production gauge */}
                            {panel.status === "active" && (
                                <div className="energy-gauge-area">
                                    <div className="energy-ring-gauge">
                                        <svg viewBox="0 0 100 100" className="energy-ring-svg">
                                            <circle cx="50" cy="50" r="42" className="energy-ring-bg" />
                                            <circle
                                                cx="50" cy="50" r="42"
                                                className="energy-ring-fill"
                                                style={{
                                                    strokeDasharray: `${(panel.efficiency_percent / 100) * 264} 264`,
                                                    stroke: effColor,
                                                }}
                                            />
                                        </svg>
                                        <div className="energy-ring-value">
                                            <span className="energy-ring-num" style={{ color: effColor }}>{panel.efficiency_percent}%</span>
                                            <span className="energy-ring-label">كفاءة</span>
                                        </div>
                                    </div>
                                    <div className="energy-gauge-stats">
                                        <div className="energy-gauge-stat">
                                            <span className="energy-gauge-stat-val">{panel.daily_production_kwh}</span>
                                            <span className="energy-gauge-stat-lbl">kWh/يوم</span>
                                        </div>
                                        <div className="energy-gauge-stat">
                                            <span className="energy-gauge-stat-val">{panel.capacity_kw}</span>
                                            <span className="energy-gauge-stat-lbl">kW قدرة</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="water-card-details">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">عدد الألواح</span>
                                    <span className="water-detail-value">{panel.panel_count} لوح</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">الانفرتر</span>
                                    <span className="water-detail-value">{panel.inverter_type}</span>
                                </div>
                                {panel.installation_date && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">تاريخ التركيب</span>
                                        <span className="water-detail-value">
                                            {new Date(panel.installation_date).toLocaleDateString("ar-TN")}
                                        </span>
                                    </div>
                                )}
                                {panel.total_cost > 0 && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">التكلفة</span>
                                        <span className="water-detail-value">{formatCurrency(panel.total_cost)}</span>
                                    </div>
                                )}
                            </div>
                            {panel.notes && <div className="water-card-note">{panel.notes}</div>}
                        </div>
                    );
                })}
            </div>

            {/* Solar summary */}
            <div className="energy-summary glass-card">
                <h4 className="energy-summary-title">📊 ملخص الطاقة الشمسية</h4>
                <div className="energy-summary-grid">
                    <div className="energy-summary-item">
                        <span className="energy-summary-val">{solar.reduce((s, p) => s + p.panel_count, 0)}</span>
                        <span className="energy-summary-lbl">إجمالي الألواح</span>
                    </div>
                    <div className="energy-summary-item">
                        <span className="energy-summary-val">{totalSolarKw} kW</span>
                        <span className="energy-summary-lbl">القدرة الإجمالية</span>
                    </div>
                    <div className="energy-summary-item">
                        <span className="energy-summary-val">{dailyProduction} kWh</span>
                        <span className="energy-summary-lbl">الإنتاج اليومي</span>
                    </div>
                    <div className="energy-summary-item">
                        <span className="energy-summary-val">{formatCurrency(solarInvestment)}</span>
                        <span className="energy-summary-lbl">إجمالي الاستثمار</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
