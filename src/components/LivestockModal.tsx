"use client";

import { useState } from "react";

interface LivestockModalProps {
    onClose: () => void;
    onSave: (data: Record<string, string>) => void;
}

export default function LivestockModal({ onClose, onSave }: LivestockModalProps) {
    const [form, setForm] = useState({
        name: "",
        tag_number: "",
        type: "sheep",
        breed: "",
        gender: "male",
        weight_kg: "",
        birth_date: "",
        status: "healthy",
        notes: "",
    });

    const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.tag_number.trim()) return;
        onSave(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="إضافة حيوان جديد">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">🐑 إضافة حيوان جديد</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="modal-form">
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">رقم التعريف *</label>
                                    <input className="modal-input" placeholder="مثال: SH-011" value={form.tag_number} onChange={(e) => set("tag_number", e.target.value)} required />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الاسم</label>
                                    <input className="modal-input" placeholder="اسم الحيوان (اختياري)" value={form.name} onChange={(e) => set("name", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">النوع</label>
                                    <select className="modal-select" value={form.type} onChange={(e) => set("type", e.target.value)}>
                                        <option value="sheep">غنم 🐑</option>
                                        <option value="cattle">بقر 🐄</option>
                                        <option value="goat">ماعز 🐐</option>
                                        <option value="poultry">دواجن 🐔</option>
                                    </select>
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الجنس</label>
                                    <select className="modal-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                                        <option value="male">ذكر ♂️</option>
                                        <option value="female">أنثى ♀️</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">السلالة</label>
                                    <input className="modal-input" placeholder="مثال: عربي - بربري" value={form.breed} onChange={(e) => set("breed", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الوزن (كغ)</label>
                                    <input className="modal-input" type="number" placeholder="45" value={form.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">تاريخ الولادة</label>
                                    <input className="modal-input" type="date" value={form.birth_date} onChange={(e) => set("birth_date", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الحالة الصحية</label>
                                    <select className="modal-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                                        <option value="healthy">سليم ✅</option>
                                        <option value="sick">مريض 🤒</option>
                                        <option value="pregnant">حامل 🤰</option>
                                        <option value="quarantine">حجر 🔒</option>
                                    </select>
                                </div>
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
