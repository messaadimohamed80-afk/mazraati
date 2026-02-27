/**
 * Climate Service — Open-Meteo API Integration & GDD Calculator
 * Uses the free Open-Meteo API (no key required) to fetch weather data
 * for the farm location and compute Growing Degree Days.
 */

/* ===== Types ===== */
export interface CurrentWeather {
    temperature: number;      // °C
    humidity: number;         // %
    rain: number;             // mm
    windSpeed: number;        // km/h
    weatherCode: number;      // WMO code
    weatherDesc: string;      // Arabic description
    weatherIcon: string;      // Emoji
    time: string;
}

export interface DailyForecast {
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    et0: number;
}

export interface ClimateData {
    current: CurrentWeather;
    forecast: DailyForecast[];
    gdd: {
        accumulated: number;
        todayGDD: number;
        baseTemp: number;
        predictedStage: string | null;
        predictedStageLabel: string | null;
        nextStageGDD: number | null;
        progressPercent: number;
    };
}

/* ===== GDD Configuration per Crop ===== */
export interface GDDStageThreshold {
    stageKey: string;
    gddMin: number;
}

export interface GDDConfig {
    baseTemp: number;
    upperLimit: number;
    thresholds: GDDStageThreshold[];
}

export const GDD_CONFIG: Record<string, GDDConfig> = {
    "زيتون": {
        baseTemp: 7,
        upperLimit: 35,
        thresholds: [
            { stageKey: "dormancy", gddMin: 0 },
            { stageKey: "budding", gddMin: 50 },
            { stageKey: "flowering", gddMin: 200 },
            { stageKey: "pollination", gddMin: 350 },
            { stageKey: "fruit_set", gddMin: 500 },
            { stageKey: "pit_hardening", gddMin: 800 },
            { stageKey: "ripening", gddMin: 1200 },
            { stageKey: "harvest", gddMin: 1600 },
        ],
    },
    "قمح": {
        baseTemp: 5,
        upperLimit: 30,
        thresholds: [
            { stageKey: "germination", gddMin: 0 },
            { stageKey: "tillering", gddMin: 100 },
            { stageKey: "elongation", gddMin: 350 },
            { stageKey: "heading", gddMin: 550 },
            { stageKey: "flowering", gddMin: 700 },
            { stageKey: "milk_ripe", gddMin: 850 },
            { stageKey: "dough_ripe", gddMin: 1050 },
            { stageKey: "harvest", gddMin: 1250 },
        ],
    },
    "طماطم": {
        baseTemp: 7.2,
        upperLimit: 33.3,
        thresholds: [
            { stageKey: "germination", gddMin: 0 },
            { stageKey: "vegetative", gddMin: 100 },
            { stageKey: "flowering", gddMin: 400 },
            { stageKey: "fruiting", gddMin: 600 },
            { stageKey: "ripening", gddMin: 900 },
            { stageKey: "harvest", gddMin: 1200 },
        ],
    },
    "فلفل": {
        baseTemp: 7.2,
        upperLimit: 33.3,
        thresholds: [
            { stageKey: "germination", gddMin: 0 },
            { stageKey: "vegetative", gddMin: 100 },
            { stageKey: "flowering", gddMin: 400 },
            { stageKey: "fruiting", gddMin: 650 },
            { stageKey: "ripening", gddMin: 950 },
            { stageKey: "harvest", gddMin: 1250 },
        ],
    },
    "لوز": {
        baseTemp: 4.5,
        upperLimit: 36,
        thresholds: [
            { stageKey: "dormancy", gddMin: 0 },
            { stageKey: "budding", gddMin: 50 },
            { stageKey: "flowering", gddMin: 200 },
            { stageKey: "fruit_set", gddMin: 400 },
            { stageKey: "fruit_growth", gddMin: 700 },
            { stageKey: "ripening", gddMin: 1100 },
            { stageKey: "harvest", gddMin: 1400 },
        ],
    },
    "حمضيات": {
        baseTemp: 12.5,
        upperLimit: 36,
        thresholds: [
            { stageKey: "dormancy", gddMin: 0 },
            { stageKey: "budding", gddMin: 80 },
            { stageKey: "flowering", gddMin: 250 },
            { stageKey: "fruit_set", gddMin: 400 },
            { stageKey: "fruit_growth", gddMin: 800 },
            { stageKey: "coloring", gddMin: 1400 },
            { stageKey: "ripening", gddMin: 1800 },
        ],
    },
    "بطيخ": {
        baseTemp: 10,
        upperLimit: 35,
        thresholds: [
            { stageKey: "germination", gddMin: 0 },
            { stageKey: "vegetative", gddMin: 80 },
            { stageKey: "branching", gddMin: 250 },
            { stageKey: "flowering", gddMin: 500 },
            { stageKey: "fruiting", gddMin: 700 },
            { stageKey: "ripening", gddMin: 1000 },
            { stageKey: "harvest", gddMin: 1300 },
        ],
    },
};

/* ===== WMO Weather Code Decoder ===== */
const WMO_CODES: Record<number, { desc: string; icon: string }> = {
    0: { desc: "صافي", icon: "☀️" },
    1: { desc: "صافي غالباً", icon: "🌤️" },
    2: { desc: "غائم جزئياً", icon: "⛅" },
    3: { desc: "غائم", icon: "☁️" },
    45: { desc: "ضباب", icon: "🌫️" },
    48: { desc: "ضباب متجمد", icon: "🌫️" },
    51: { desc: "رذاذ خفيف", icon: "🌦️" },
    53: { desc: "رذاذ", icon: "🌦️" },
    55: { desc: "رذاذ كثيف", icon: "🌧️" },
    61: { desc: "مطر خفيف", icon: "🌦️" },
    63: { desc: "مطر", icon: "🌧️" },
    65: { desc: "مطر غزير", icon: "🌧️" },
    71: { desc: "ثلج خفيف", icon: "🌨️" },
    73: { desc: "ثلج", icon: "❄️" },
    75: { desc: "ثلج كثيف", icon: "❄️" },
    80: { desc: "زخات مطر", icon: "🌦️" },
    81: { desc: "زخات مطر متوسطة", icon: "🌧️" },
    82: { desc: "زخات مطر غزيرة", icon: "⛈️" },
    95: { desc: "عواصف رعدية", icon: "⛈️" },
    96: { desc: "عواصف مع بَرَد", icon: "⛈️" },
    99: { desc: "عواصف رعدية قوية", icon: "⛈️" },
};

function decodeWeatherCode(code: number): { desc: string; icon: string } {
    return WMO_CODES[code] || { desc: "غير معروف", icon: "❓" };
}

/* ===== API Functions ===== */
const API_BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchClimateData(
    lat: number,
    lng: number,
    cropType: string,
    plantingDate?: string
): Promise<ClimateData> {
    // Calculate how many past days we need for GDD
    let pastDays = 7;
    if (plantingDate) {
        const plantDate = new Date(plantingDate);
        const now = new Date();
        const daysDiff = Math.ceil((now.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
        pastDays = Math.min(Math.max(daysDiff, 7), 92); // API max is 92 past days
    }

    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lng.toString(),
        timezone: "Africa/Tunis",
        past_days: pastDays.toString(),
        current: "temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m",
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration",
    });

    /* ===== Open-Meteo API Response Types ===== */
    interface OpenMeteoCurrentResponse {
        temperature_2m: number;
        relative_humidity_2m: number;
        rain: number;
        wind_speed_10m: number;
        weather_code: number;
        time: string;
    }

    interface OpenMeteoDailyResponse {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        et0_fao_evapotranspiration: number[];
    }

    interface OpenMeteoResponse {
        current: OpenMeteoCurrentResponse;
        daily: OpenMeteoDailyResponse;
    }

    const response = await fetch(`${API_BASE}?${params}`);
    if (!response.ok) throw new Error(`Open-Meteo API error: ${response.status}`);
    const data: OpenMeteoResponse = await response.json();

    // Parse current weather
    const weather = decodeWeatherCode(data.current.weather_code);
    const current: CurrentWeather = {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        rain: data.current.rain,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        weatherDesc: weather.desc,
        weatherIcon: weather.icon,
        time: data.current.time,
    };

    // Parse daily data
    const dailyTimes: string[] = data.daily.time;
    const allDays: DailyForecast[] = dailyTimes.map((date: string, i: number) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitation: data.daily.precipitation_sum[i],
        et0: data.daily.et0_fao_evapotranspiration[i],
    }));

    // Separate past (for GDD) and future (forecast) days
    const today = new Date().toISOString().split("T")[0];
    const forecastDays = allDays.filter((d) => d.date >= today).slice(0, 7);

    // Calculate GDD
    const config = GDD_CONFIG[cropType];
    const baseTemp = config?.baseTemp ?? 10;
    const upperLimit = config?.upperLimit ?? 35;

    // Filter days from planting date to today
    const gddDays = plantingDate
        ? allDays.filter((d) => d.date >= plantingDate && d.date <= today)
        : allDays.filter((d) => d.date <= today);

    let accumulated = 0;
    let todayGDD = 0;
    for (const day of gddDays) {
        const tMax = Math.min(day.tempMax, upperLimit);
        const tMin = Math.max(day.tempMin, baseTemp);
        const avgTemp = (tMax + tMin) / 2;
        const dayGDD = Math.max(0, avgTemp - baseTemp);
        accumulated += dayGDD;
        if (day.date === today) todayGDD = dayGDD;
    }

    // Predict stage from accumulated GDD
    const thresholds = config?.thresholds ?? [];
    let predictedStage: string | null = null;
    const predictedStageLabel: string | null = null;
    let nextStageGDD: number | null = null;
    let progressPercent = 0;

    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (accumulated >= thresholds[i].gddMin) {
            predictedStage = thresholds[i].stageKey;
            // Find the next stage threshold
            if (i < thresholds.length - 1) {
                nextStageGDD = thresholds[i + 1].gddMin;
                const currentMin = thresholds[i].gddMin;
                progressPercent = ((accumulated - currentMin) / (nextStageGDD - currentMin)) * 100;
                progressPercent = Math.min(progressPercent, 100);
            } else {
                progressPercent = 100;
            }
            break;
        }
    }

    // Round accumulated
    accumulated = Math.round(accumulated);

    return {
        current,
        forecast: forecastDays,
        gdd: {
            accumulated,
            todayGDD: Math.round(todayGDD * 10) / 10,
            baseTemp,
            predictedStage,
            predictedStageLabel,
            nextStageGDD,
            progressPercent: Math.round(progressPercent),
        },
    };
}
