"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { getFarmSettings, updateFarmSettings } from "@/lib/actions/settings";

export default function SettingsPage() {
    const { theme, toggle } = useTheme();
    const [farmName, setFarmName] = useState("مزرعة الأمل");
    const [ownerName, setOwnerName] = useState("محمد بن علي");
    const [phone, setPhone] = useState("+216 71 123 456");
    const [email, setEmail] = useState("farm@example.com");
    const [location, setLocation] = useState("باجة، تونس");
    const [currency, setCurrency] = useState("TND");
    const [language, setLanguage] = useState("ar");
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifLowStock, setNotifLowStock] = useState(true);
    const [notifOverdue, setNotifOverdue] = useState(true);
    const [notifWeather, setNotifWeather] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Load settings from server
    useEffect(() => {
        getFarmSettings().then((s) => {
            if (s.farmName) setFarmName(s.farmName);
            if (s.ownerName) setOwnerName(s.ownerName);
            if (s.phone) setPhone(s.phone);
            if (s.email) setEmail(s.email);
            if (s.location) setLocation(s.location);
            if (s.currency) setCurrency(s.currency);
        }).catch(() => setError("تعذر تحميل الإعدادات"));
    }, []);

    const handleSave = async () => {
        setError("");
        try {
            const result = await updateFarmSettings({ farmName, ownerName, phone, email, location, currency });
            if (result.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            } else {
                setError(result.error || "فشل في حفظ الإعدادات");
            }
        } catch {
            setError("حدث خطأ أثناء الحفظ");
        }
    };

    return (
        <>
            <div className="page-header">
                <div className="page-header-text">
                    <h1 className="page-title">⚙️ الإعدادات</h1>
                    <p className="page-subtitle">إعدادات الحساب والمزرعة</p>
                </div>
            </div>

            <div className="settings-grid">
                {/* Farm Profile */}
                <div className="settings-card glass-card">
                    <h3 className="settings-card-title">🏡 معلومات المزرعة</h3>
                    <div className="modal-form">
                        <div className="modal-field">
                            <label className="modal-label">اسم المزرعة</label>
                            <input className="modal-input" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">اسم المالك</label>
                            <input className="modal-input" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                        </div>
                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">الهاتف</label>
                                <input className="modal-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">البريد الإلكتروني</label>
                                <input className="modal-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">الموقع</label>
                            <input className="modal-input" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-card glass-card">
                    <h3 className="settings-card-title">🎨 المظهر</h3>
                    <div className="modal-form">
                        <div className="modal-field">
                            <label className="modal-label">الوضع</label>
                            <div className="settings-theme-options">
                                <button
                                    className={`settings-theme-btn ${theme === "dark" ? "settings-theme-active" : ""}`}
                                    onClick={() => { if (theme !== "dark") toggle(); }}
                                >
                                    🌙 داكن
                                </button>
                                <button
                                    className={`settings-theme-btn ${theme === "light" ? "settings-theme-active" : ""}`}
                                    onClick={() => { if (theme !== "light") toggle(); }}
                                >
                                    ☀️ فاتح
                                </button>
                            </div>
                        </div>
                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">العملة</label>
                                <select className="modal-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                    <option value="TND">دينار تونسي (TND)</option>
                                    <option value="SAR">ريال سعودي (SAR)</option>
                                    <option value="USD">دولار أمريكي (USD)</option>
                                    <option value="EUR">يورو (EUR)</option>
                                </select>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">اللغة</label>
                                <select className="modal-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="ar">العربية</option>
                                    <option value="fr">الفرنسية</option>
                                    <option value="en">الإنجليزية</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card glass-card">
                    <h3 className="settings-card-title">🔔 الإشعارات</h3>
                    <div className="settings-toggle-list">
                        <label className="settings-toggle-item">
                            <span>إشعارات البريد الإلكتروني</span>
                            <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="settings-checkbox" />
                        </label>
                        <label className="settings-toggle-item">
                            <span>تنبيه مخزون منخفض</span>
                            <input type="checkbox" checked={notifLowStock} onChange={(e) => setNotifLowStock(e.target.checked)} className="settings-checkbox" />
                        </label>
                        <label className="settings-toggle-item">
                            <span>تنبيه مهام متأخرة</span>
                            <input type="checkbox" checked={notifOverdue} onChange={(e) => setNotifOverdue(e.target.checked)} className="settings-checkbox" />
                        </label>
                        <label className="settings-toggle-item">
                            <span>تنبيهات الطقس</span>
                            <input type="checkbox" checked={notifWeather} onChange={(e) => setNotifWeather(e.target.checked)} className="settings-checkbox" />
                        </label>
                    </div>
                </div>

                {/* About */}
                <div className="settings-card glass-card">
                    <h3 className="settings-card-title">ℹ️ حول التطبيق</h3>
                    <div className="settings-about">
                        <div className="settings-about-row"><span>الإصدار</span><span className="settings-about-value">1.0.0</span></div>
                        <div className="settings-about-row"><span>إطار العمل</span><span className="settings-about-value">Next.js 16</span></div>
                        <div className="settings-about-row"><span>الرسوم البيانية</span><span className="settings-about-value">Recharts</span></div>
                        <div className="settings-about-row"><span>آخر تحديث</span><span className="settings-about-value">فبراير 2026</span></div>
                    </div>
                </div>
            </div>

            {/* Save */}
            {error && (
                <div style={{ padding: "0 1.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-sm)", color: "#ef4444", fontSize: "0.85rem" }}>
                        ⚠️ {error}
                    </div>
                </div>
            )}
            <div style={{ padding: "0 1.5rem 2rem", display: "flex", justifyContent: "flex-end", gap: "0.6rem" }}>
                <button className="modal-btn modal-btn-save" onClick={handleSave}>
                    {saved ? "✅ تم الحفظ!" : "💾 حفظ الإعدادات"}
                </button>
            </div>
        </>
    );
}

