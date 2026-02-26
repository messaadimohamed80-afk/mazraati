"use client";

import { useState, useEffect } from "react";
import { fetchClimateData, ClimateData } from "@/lib/climate-service";
import { getCropPhenologyStages } from "@/lib/mock/mock-crops-tasks-data";

interface ClimatePanelProps {
    lat: number;
    lng: number;
    cropType: string;
    plantingDate?: string;
    cropColor: string;
}

export default function ClimatePanel({ lat, lng, cropType, plantingDate, cropColor }: ClimatePanelProps) {
    const [data, setData] = useState<ClimateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchClimateData(lat, lng, cropType, plantingDate)
            .then((result) => {
                if (!cancelled) {
                    // Resolve predicted stage label
                    if (result.gdd.predictedStage) {
                        const stages = getCropPhenologyStages(cropType);
                        const stage = stages.find((s) => s.key === result.gdd.predictedStage);
                        if (stage) result.gdd.predictedStageLabel = stage.label;
                    }
                    setData(result);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => { cancelled = true; };
    }, [lat, lng, cropType, plantingDate]);

    if (loading) {
        return (
            <div className="climate-panel glass-card climate-loading">
                <div className="climate-spinner" />
                <span>جارٍ تحميل بيانات المناخ...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="climate-panel glass-card climate-error">
                <span>⚠️ تعذر تحميل بيانات المناخ</span>
                <span className="climate-error-detail">{error}</span>
            </div>
        );
    }

    const { current, forecast, gdd } = data;

    // Day name helper
    const dayName = (dateStr: string) => {
        const d = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return "اليوم";
        if (d.toDateString() === tomorrow.toDateString()) return "غداً";
        return d.toLocaleDateString("ar-TN", { weekday: "short" });
    };

    return (
        <div className="climate-panel glass-card">
            <h2 className="crop-detail-section-title">
                <span className="section-title-dot" style={{ background: "#06b6d4" }} />
                🌡️ المناخ ودرجات الحرارة المتراكمة
            </h2>

            <div className="climate-grid">
                {/* Current Weather */}
                <div className="climate-current">
                    <div className="climate-current-main">
                        <span className="climate-weather-icon">{current.weatherIcon}</span>
                        <div className="climate-temp-block">
                            <span className="climate-temp">{Math.round(current.temperature)}°</span>
                            <span className="climate-weather-desc">{current.weatherDesc}</span>
                        </div>
                    </div>
                    <div className="climate-stats">
                        <div className="climate-stat">
                            <span className="climate-stat-icon">💧</span>
                            <span className="climate-stat-value">{current.humidity}%</span>
                            <span className="climate-stat-label">رطوبة</span>
                        </div>
                        <div className="climate-stat">
                            <span className="climate-stat-icon">🌧️</span>
                            <span className="climate-stat-value">{current.rain} mm</span>
                            <span className="climate-stat-label">أمطار</span>
                        </div>
                        <div className="climate-stat">
                            <span className="climate-stat-icon">💨</span>
                            <span className="climate-stat-value">{Math.round(current.windSpeed)}</span>
                            <span className="climate-stat-label">كم/س</span>
                        </div>
                    </div>
                </div>

                {/* GDD Progress */}
                <div className="climate-gdd">
                    <div className="climate-gdd-header">
                        <span className="climate-gdd-title">🌱 درجات النمو المتراكمة (GDD)</span>
                        <span className="climate-gdd-base">T_base = {gdd.baseTemp}°C</span>
                    </div>
                    <div className="climate-gdd-value-row">
                        <span className="climate-gdd-value" style={{ color: cropColor }}>
                            {gdd.accumulated}
                        </span>
                        <span className="climate-gdd-unit">°يوم</span>
                        {gdd.nextStageGDD && (
                            <span className="climate-gdd-next">/ {gdd.nextStageGDD}</span>
                        )}
                    </div>
                    <div className="climate-gdd-bar-container">
                        <div
                            className="climate-gdd-bar-fill"
                            style={{
                                width: `${Math.min(gdd.progressPercent, 100)}%`,
                                background: `linear-gradient(90deg, ${cropColor}40, ${cropColor})`,
                            }}
                        />
                    </div>
                    <div className="climate-gdd-stage-row">
                        {gdd.predictedStageLabel && (
                            <span className="climate-gdd-predicted" style={{ color: cropColor }}>
                                📍 المرحلة المتوقعة: <strong>{gdd.predictedStageLabel}</strong>
                            </span>
                        )}
                        <span className="climate-gdd-today">
                            +{gdd.todayGDD}° اليوم
                        </span>
                    </div>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="climate-forecast">
                <h3 className="climate-forecast-title">📅 توقعات 7 أيام</h3>
                <div className="climate-forecast-strip" style={{ direction: "ltr" }}>
                    {forecast.map((day) => (
                        <div key={day.date} className="climate-forecast-day">
                            <span className="climate-forecast-day-name">{dayName(day.date)}</span>
                            <span className="climate-forecast-precip">
                                {day.precipitation > 0 ? "🌧️" : "☀️"}
                            </span>
                            <div className="climate-forecast-temps">
                                <span className="climate-forecast-high">{Math.round(day.tempMax)}°</span>
                                <div className="climate-forecast-bar-bg">
                                    <div
                                        className="climate-forecast-bar-inner"
                                        style={{
                                            height: `${Math.max(20, Math.min(100, (day.tempMax / 40) * 100))}%`,
                                            background: `linear-gradient(to top, #3b82f6, ${day.tempMax > 25 ? "#ef4444" : day.tempMax > 15 ? "#f59e0b" : "#06b6d4"})`,
                                        }}
                                    />
                                </div>
                                <span className="climate-forecast-low">{Math.round(day.tempMin)}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
