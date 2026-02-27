"use client";

import { useState, useEffect } from "react";

function getWeather(): { temp: number; icon: string; desc: string; humidity: number } {
    const month = new Date().getMonth();
    const temps: Record<number, [number, number]> = {
        0: [8, 15], 1: [9, 16], 2: [11, 19], 3: [14, 22], 4: [17, 26],
        5: [21, 31], 6: [24, 34], 7: [25, 35], 8: [22, 31], 9: [18, 26],
        10: [13, 21], 11: [9, 16],
    };
    const [lo, hi] = temps[month] || [15, 25];
    const hour = new Date().getHours();
    const t = hour < 6 ? lo : hour < 14 ? Math.round(lo + (hi - lo) * (hour - 6) / 8) : Math.round(hi - (hi - lo) * (hour - 14) / 10);
    const icons: Record<number, string> = { 0: "❄️", 1: "🌧️", 2: "🌤️", 3: "☀️", 4: "☀️", 5: "☀️", 6: "☀️", 7: "☀️", 8: "🌤️", 9: "🌤️", 10: "🌧️", 11: "❄️" };
    const descs: Record<number, string> = { 0: "بارد", 1: "ممطر", 2: "معتدل", 3: "مشمس", 4: "مشمس", 5: "حار", 6: "حار جداً", 7: "حار جداً", 8: "معتدل", 9: "معتدل", 10: "ممطر", 11: "بارد" };
    const day = new Date().getDate();
    const humidity = month >= 5 && month <= 8 ? 35 + (day % 11) : 55 + (day % 21);
    return { temp: t, icon: icons[month] || "☀️", desc: descs[month] || "معتدل", humidity };
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState(() => getWeather());

    // Refresh weather data every hour
    useEffect(() => {
        const timer = setInterval(() => {
            setWeather(getWeather());
        }, 3600000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="header-badge" title={`${weather.desc} — رطوبة ${weather.humidity}%`} aria-label={`الطقس: ${weather.desc} ${weather.temp} درجة`}>
            <span>{weather.icon}</span>
            <span>{weather.temp}°C</span>
        </div>
    );
}
