import { IrrigationNetwork } from "@/lib/types";
import { IRRIGATION_TYPE_MAP, IRRIGATION_STATUS_MAP } from "@/lib/mock/mock-water-data";

export function IrrigationTab({ irrigation }: { irrigation: IrrigationNetwork[] }) {
    return (
        <div className="water-content">
            <div className="water-cards-grid water-cards-wide">
                {irrigation.map((irr) => {
                    const typeInfo = IRRIGATION_TYPE_MAP[irr.type];
                    const statusInfo = IRRIGATION_STATUS_MAP[irr.status];

                    return (
                        <div key={irr.id} className="water-card glass-card water-card-wide">
                            <div className="water-card-header">
                                <div>
                                    <h3 className="water-card-name">{irr.name}</h3>
                                    <span className="water-card-type-tag">
                                        {typeInfo.icon} {typeInfo.label}
                                    </span>
                                </div>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${statusInfo.color}18`, color: statusInfo.color, borderColor: `${statusInfo.color}40` }}
                                >
                                    {statusInfo.label}
                                </span>
                            </div>

                            {/* Coverage bar */}
                            <div className="irr-coverage">
                                <div className="irr-coverage-header">
                                    <span>المساحة المغطاة</span>
                                    <span className="irr-coverage-value">{irr.coverage_hectares} هكتار</span>
                                </div>
                                <div className="irr-coverage-bar">
                                    <div
                                        className="irr-coverage-fill"
                                        style={{
                                            width: `${Math.min((irr.coverage_hectares / 3) * 100, 100)}%`,
                                            background: statusInfo.color,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="water-card-details water-card-details-row">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">المصدر</span>
                                    <span className="water-detail-value">{irr.source_name}</span>
                                </div>
                                {irr.flow_rate_lph && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">التدفق</span>
                                        <span className="water-detail-value">{irr.flow_rate_lph} لتر/ساعة</span>
                                    </div>
                                )}
                                {irr.last_maintenance && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">آخر صيانة</span>
                                        <span className="water-detail-value">
                                            {new Date(irr.last_maintenance).toLocaleDateString("ar-TN")}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {irr.notes && (
                                <div className="water-card-note">{irr.notes}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
