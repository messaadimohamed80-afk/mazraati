import { ElectricityMeter } from "@/lib/types";
import { ELEC_STATUS_MAP, ELEC_TARIFF_MAP } from "@/lib/mock/mock-energy-data";
import { formatCurrency } from "@/lib/utils";

export function ElectricityTab({ electricity }: { electricity: ElectricityMeter[] }) {
    return (
        <div className="water-content">
            <div className="water-cards-grid water-cards-wide">
                {electricity.map((meter) => {
                    const status = ELEC_STATUS_MAP[meter.status];
                    const consumptionPercent = Math.min((meter.monthly_consumption_kwh / 600) * 100, 100);

                    return (
                        <div key={meter.id} className="water-card glass-card water-card-wide">
                            <div className="water-card-header">
                                <div>
                                    <h3 className="water-card-name">{meter.name}</h3>
                                    <span className="water-card-type-tag">
                                        🏷️ {ELEC_TARIFF_MAP[meter.tariff_type]}
                                    </span>
                                </div>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                >
                                    {status.label}
                                </span>
                            </div>

                            {/* Consumption bar */}
                            <div className="irr-coverage">
                                <div className="irr-coverage-header">
                                    <span>الاستهلاك الشهري</span>
                                    <span className="irr-coverage-value">{meter.monthly_consumption_kwh} kWh</span>
                                </div>
                                <div className="irr-coverage-bar" style={{ height: "12px" }}>
                                    <div
                                        className="irr-coverage-fill"
                                        style={{
                                            width: `${consumptionPercent}%`,
                                            background: consumptionPercent > 80 ? "#ef4444" : consumptionPercent > 50 ? "#f59e0b" : "#10b981",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="water-card-details water-card-details-row">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">رقم العداد</span>
                                    <span className="water-detail-value" style={{ fontSize: "0.75rem", direction: "ltr" }}>{meter.meter_number}</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">المزوّد</span>
                                    <span className="water-detail-value">{meter.provider}</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">الفاتورة الشهرية</span>
                                    <span className="water-detail-value" style={{ color: "#ef4444", fontWeight: 800 }}>
                                        {formatCurrency(meter.monthly_cost)}
                                    </span>
                                </div>
                            </div>
                            <div className="water-card-details" style={{ marginTop: "0.5rem" }}>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">آخر قراءة</span>
                                    <span className="water-detail-value">
                                        {new Date(meter.last_reading_date).toLocaleDateString("ar-TN")}
                                    </span>
                                </div>
                            </div>
                            {meter.notes && <div className="water-card-note">{meter.notes}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
