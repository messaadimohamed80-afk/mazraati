import { Generator } from "@/lib/types";
import { GEN_STATUS_MAP, FUEL_TYPE_MAP } from "@/lib/mock/mock-energy-data";
import { formatCurrency } from "@/lib/utils";

export function GeneratorsTab({ generators }: { generators: Generator[] }) {
    return (
        <div className="water-content">
            <div className="water-cards-grid">
                {generators.map((gen) => {
                    const status = GEN_STATUS_MAP[gen.status];
                    const fuel = FUEL_TYPE_MAP[gen.fuel_type];
                    const maintenancePercent = Math.round((gen.runtime_hours / gen.next_maintenance_hours) * 100);
                    const maintenanceColor = maintenancePercent > 90 ? "#ef4444" : maintenancePercent > 70 ? "#f59e0b" : "#10b981";

                    return (
                        <div key={gen.id} className="water-card glass-card">
                            <div className="water-card-header">
                                <h3 className="water-card-name">{gen.name}</h3>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                >
                                    {status.icon} {status.label}
                                </span>
                            </div>

                            {/* Runtime gauge */}
                            <div className="gen-runtime">
                                <div className="gen-runtime-header">
                                    <span>الصيانة القادمة</span>
                                    <span style={{ color: maintenanceColor, fontWeight: 700 }}>{maintenancePercent}%</span>
                                </div>
                                <div className="irr-coverage-bar">
                                    <div
                                        className="irr-coverage-fill"
                                        style={{
                                            width: `${maintenancePercent}%`,
                                            background: maintenanceColor,
                                        }}
                                    />
                                </div>
                                <div className="gen-runtime-info">
                                    <span>{gen.runtime_hours} ساعة</span>
                                    <span>من {gen.next_maintenance_hours} ساعة</span>
                                </div>
                            </div>

                            <div className="water-card-details">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">الوقود</span>
                                    <span className="water-detail-value">{fuel.icon} {fuel.label}</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">القدرة</span>
                                    <span className="water-detail-value">{gen.capacity_kva} kVA</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">استهلاك الوقود</span>
                                    <span className="water-detail-value">{gen.fuel_consumption_lph} لتر/ساعة</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">آخر صيانة</span>
                                    <span className="water-detail-value">
                                        {new Date(gen.last_maintenance).toLocaleDateString("ar-TN")}
                                    </span>
                                </div>
                            </div>
                            {gen.total_cost > 0 && (
                                <div className="water-card-details" style={{ marginTop: "0.5rem" }}>
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">التكلفة</span>
                                        <span className="water-detail-value">{formatCurrency(gen.total_cost)}</span>
                                    </div>
                                </div>
                            )}
                            {gen.notes && <div className="water-card-note">{gen.notes}</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
