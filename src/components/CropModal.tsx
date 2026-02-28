"use client";

import { useState, useEffect } from "react";

interface CropModalProps {
    onClose: () => void;
    onSave: (data: Record<string, string>) => void;
}

export default function CropModal({ onClose, onSave }: CropModalProps) {
    const [form, setForm] = useState({
        crop_type: "",
        variety: "",
        field_name: "",
        area_hectares: "",
        planting_date: "",
        expected_harvest: "",
        status: "planned",
        notes: "",
    });

    const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.crop_type.trim()) return;
        onSave(form);
        onClose();
    };

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Focus trap: keep focus within modal
    useEffect(() => {
        const modal = document.querySelector(".modal-container") as HTMLElement | null;
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        first.focus();

        const trap = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        modal.addEventListener("keydown", trap);
        return () => modal.removeEventListener("keydown", trap);
    }, []);

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="إضافة محصول جديد">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">🌾 إضافة محصول جديد</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="modal-form">
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">نوع المحصول *</label>
                                    <input className="modal-input" placeholder="مثال: قمح، شعير، زيتون" value={form.crop_type} onChange={(e) => set("crop_type", e.target.value)} required />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الصنف</label>
                                    <input className="modal-input" placeholder="مثال: قمح صلب" value={form.variety} onChange={(e) => set("variety", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">اسم القطعة</label>
                                    <input className="modal-input" placeholder="مثال: الحقل الشمالي" value={form.field_name} onChange={(e) => set("field_name", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">المساحة (هكتار)</label>
                                    <input className="modal-input" type="number" step="0.1" placeholder="2.5" value={form.area_hectares} onChange={(e) => set("area_hectares", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">تاريخ الزراعة</label>
                                    <input className="modal-input" type="date" value={form.planting_date} onChange={(e) => set("planting_date", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">تاريخ الحصاد المتوقع</label>
                                    <input className="modal-input" type="date" value={form.expected_harvest} onChange={(e) => set("expected_harvest", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">الحالة</label>
                                <select className="modal-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                                    <option value="planned">مخطط 📋</option>
                                    <option value="planted">مزروع 🌱</option>
                                    <option value="growing">ينمو 🌿</option>
                                    <option value="harvested">تم الحصاد ✅</option>
                                </select>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">ملاحظات</label>
                                <textarea className="modal-textarea" placeholder="ملاحظات إضافية..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="modal-btn modal-btn-cancel" onClick={onClose}>إلغاء</button>
                        <button type="submit" className="modal-btn modal-btn-save">💾 حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
