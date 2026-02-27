import { useMemo } from "react";
import { Well } from "@/lib/types";
import {
    MOCK_WELL_LAYERS,
    WELL_STATUS_MAP,
    WATER_QUALITY_MAP,
} from "@/lib/mock/mock-water-data";
import { formatCurrency } from "@/lib/utils";

const LAYER_COLORS: Record<string, string> = {
    soil: "#8B6914",
    clay: "#CD853F",
    rock: "#708090",
    sand: "#F4A460",
    water: "#4FC3F7",
    gravel: "#A0A0A0",
};

const LAYER_LABELS: Record<string, string> = {
    soil: "تربة",
    clay: "طين",
    rock: "صخر",
    sand: "رمل",
    water: "ماء",
    gravel: "حصى",
};

export function WellsTab({
    wells,
    selectedWellId,
    setSelectedWellId
}: {
    wells: Well[];
    selectedWellId: string | null;
    setSelectedWellId: (id: string | null) => void;
}) {
    const selectedWell = wells.find((w) => w.id === selectedWellId);
    const wellLayers = useMemo(
        () => MOCK_WELL_LAYERS.filter((l) => l.well_id === selectedWellId),
        [selectedWellId]
    );

    return (
        <div className="water-content">
            <div className="water-cards-grid">
                {wells.map((well) => {
                    const status = WELL_STATUS_MAP[well.status];
                    const quality = WATER_QUALITY_MAP[well.water_quality];
                    const waterPercent = well.water_level_meters
                        ? Math.round((1 - well.water_level_meters / well.depth_meters) * 100)
                        : 0;
                    const isSelected = selectedWellId === well.id;

                    return (
                        <div
                            key={well.id}
                            className={`water-card glass-card ${isSelected ? "water-card-selected" : ""}`}
                            onClick={() => setSelectedWellId(isSelected ? null : well.id)}
                        >
                            <div className="water-card-header">
                                <h3 className="water-card-name">{well.name}</h3>
                                <span
                                    className="water-card-badge"
                                    style={{ background: `${status.color}18`, color: status.color, borderColor: `${status.color}40` }}
                                >
                                    {status.icon} {status.label}
                                </span>
                            </div>

                            {/* Well visualization */}
                            <div className="well-viz">
                                <div className="well-tube">
                                    <div
                                        className="well-water"
                                        style={{ height: `${waterPercent}%` }}
                                    />
                                    <div className="well-depth-label">
                                        {well.depth_meters} م
                                    </div>
                                    {well.water_level_meters && (
                                        <div
                                            className="well-level-marker"
                                            style={{ top: `${(well.water_level_meters / well.depth_meters) * 100}%` }}
                                        >
                                            <span className="well-level-text">{well.water_level_meters} م</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="water-card-details">
                                <div className="water-card-detail">
                                    <span className="water-detail-label">العمق</span>
                                    <span className="water-detail-value">{well.depth_meters} متر</span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">مستوى الماء</span>
                                    <span className="water-detail-value">
                                        {well.water_level_meters ? `${well.water_level_meters} م` : "—"}
                                    </span>
                                </div>
                                <div className="water-card-detail">
                                    <span className="water-detail-label">الملوحة</span>
                                    <span className="water-detail-value" style={{ color: quality.color }}>
                                        {well.salinity_ppm ? `${well.salinity_ppm} ppm` : quality.label}
                                    </span>
                                </div>
                                {well.total_cost && (
                                    <div className="water-card-detail">
                                        <span className="water-detail-label">التكلفة</span>
                                        <span className="water-detail-value">{formatCurrency(well.total_cost)}</span>
                                    </div>
                                )}
                            </div>

                            {isSelected && <div className="water-card-expand-hint">▲ انقر لإخفاء الطبقات</div>}
                            {!isSelected && well.status !== "inactive" && (
                                <div className="water-card-expand-hint">▼ انقر لعرض الطبقات الجيولوجية</div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Well Layers Detail */}
            {selectedWell && wellLayers.length > 0 && (
                <div className="well-layers-panel glass-card">
                    <h3 className="well-layers-title">
                        🪨 الطبقات الجيولوجية — {selectedWell.name}
                    </h3>
                    <div className="well-layers-viz">
                        {wellLayers.map((layer) => {
                            const heightPercent = ((layer.depth_to - layer.depth_from) / selectedWell.depth_meters) * 100;
                            return (
                                <div
                                    key={layer.id}
                                    className="well-layer-bar"
                                    style={{
                                        height: `${Math.max(heightPercent, 8)}%`,
                                        background: LAYER_COLORS[layer.layer_type] || "#666",
                                    }}
                                >
                                    <span className="well-layer-label">
                                        {LAYER_LABELS[layer.layer_type]} ({layer.depth_from}-{layer.depth_to} م)
                                    </span>
                                    {layer.notes && (
                                        <span className="well-layer-note">{layer.notes}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="well-layers-legend">
                        {Object.entries(LAYER_LABELS).map(([key, label]) => (
                            <span key={key} className="well-layer-legend-item">
                                <span className="well-layer-dot" style={{ background: LAYER_COLORS[key] }} />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
