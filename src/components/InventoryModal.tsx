"use client";

import { useState } from "react";

interface InventoryModalProps {
    onClose: () => void;
    onSave: (data: Record<string, string>) => void;
}

export default function InventoryModal({ onClose, onSave }: InventoryModalProps) {
    const [form, setForm] = useState({
        name: "",
        category: "equipment",
        quantity: "",
        unit: "",
        min_stock: "",
        location: "",
        purchase_price: "",
        condition: "good",
        notes: "",
    });

    const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSave(form);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="إضافة عنصر جديد">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">📦 إضافة عنصر جديد</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="modal-form">
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">اسم العنصر *</label>
                                    <input className="modal-input" placeholder="مثال: جرار زراعي" value={form.name} onChange={(e) => set("name", e.target.value)} required />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الصنف</label>
                                    <select className="modal-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                                        <option value="equipment">معدات 🚜</option>
                                        <option value="chemicals">مواد كيميائية 🧪</option>
                                        <option value="seeds">بذور 🌱</option>
                                        <option value="tools">أدوات 🔧</option>
                                        <option value="supplies">مستلزمات 📋</option>
                                        <option value="spare_parts">قطع غيار ⚙️</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">الكمية</label>
                                    <input className="modal-input" type="number" placeholder="10" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الوحدة</label>
                                    <input className="modal-input" placeholder="مثال: كغ، لتر، قطعة" value={form.unit} onChange={(e) => set("unit", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">الحد الأدنى للمخزون</label>
                                    <input className="modal-input" type="number" placeholder="5" value={form.min_stock} onChange={(e) => set("min_stock", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">سعر الشراء (د.ت)</label>
                                    <input className="modal-input" type="number" placeholder="250" value={form.purchase_price} onChange={(e) => set("purchase_price", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-row">
                                <div className="modal-field">
                                    <label className="modal-label">الموقع</label>
                                    <input className="modal-input" placeholder="مثال: المخزن الرئيسي" value={form.location} onChange={(e) => set("location", e.target.value)} />
                                </div>
                                <div className="modal-field">
                                    <label className="modal-label">الحالة</label>
                                    <select className="modal-select" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
                                        <option value="new">جديد ✨</option>
                                        <option value="good">جيد ✅</option>
                                        <option value="fair">متوسط ⚠️</option>
                                        <option value="needs_repair">يحتاج صيانة 🔧</option>
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
