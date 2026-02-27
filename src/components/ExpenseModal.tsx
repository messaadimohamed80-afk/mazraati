"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Expense, Category } from "@/lib/types";

interface ExpenseModalProps {
    expense: Expense | null;
    categories: Category[];
    onSave: (expense: Omit<Expense, "id" | "created_at" | "created_by" | "farm_id">) => void;
    onClose: () => void;
}

export default function ExpenseModal({
    expense,
    categories,
    onSave,
    onClose,
}: ExpenseModalProps) {
    const [categoryId, setCategoryId] = useState(expense?.category_id || categories[0]?.id || "");
    const [amount, setAmount] = useState(expense?.amount?.toString() || "");
    const [currency, setCurrency] = useState(expense?.currency || "TND");
    const [description, setDescription] = useState(expense?.description || "");
    const [notes, setNotes] = useState(expense?.notes || "");
    const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0]);
    const [error, setError] = useState("");

    // Close on Escape + focus trap
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!amount || parseFloat(amount) <= 0) {
            setError("يرجى إدخال مبلغ صحيح");
            return;
        }
        if (!description.trim()) {
            setError("يرجى إدخال وصف المصروف");
            return;
        }

        onSave({
            category_id: categoryId,
            amount: parseFloat(amount),
            currency,
            description: description.trim(),
            notes: notes.trim() || undefined,
            date,
            receipt_url: expense?.receipt_url,
        });
    };

    const selectedCat = categories.find((c) => c.id === categoryId);

    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        {expense ? "✏️ تعديل المصروف" : "➕ إضافة مصروف جديد"}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="auth-error" style={{ margin: "0 0 1rem" }}>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-form">
                    {/* Category */}
                    <div className="modal-field">
                        <label className="modal-label">التصنيف</label>
                        <div className="category-picker">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`category-pick-btn ${categoryId === cat.id ? "category-pick-active" : ""}`}
                                    style={{
                                        borderColor: categoryId === cat.id ? cat.color : undefined,
                                        background: categoryId === cat.id ? `${cat.color}18` : undefined,
                                    }}
                                    onClick={() => setCategoryId(cat.id)}
                                >
                                    <span>{cat.icon}</span>
                                    <span className="category-pick-name">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount + Currency */}
                    <div className="modal-row">
                        <div className="modal-field modal-field-grow">
                            <label className="modal-label">المبلغ</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="modal-input modal-amount-input"
                                style={{ borderColor: selectedCat?.color }}
                                min="0"
                                step="100"
                                required
                                dir="ltr"
                            />
                        </div>
                        <div className="modal-field" style={{ minWidth: "130px" }}>
                            <label className="modal-label">العملة</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="modal-input modal-select"
                            >
                                <option value="TND">🇹🇳 د.ت</option>
                                <option value="DZD">🇩🇿 د.ج</option>
                                <option value="SAR">🇸🇦 ر.س</option>
                                <option value="EGP">🇪🇬 ج.م</option>
                                <option value="MAD">🇲🇦 د.م</option>
                                <option value="USD">🇺🇸 $</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="modal-field">
                        <label className="modal-label">الوصف</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="وصف المصروف..."
                            className="modal-input"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="modal-field">
                        <label className="modal-label">التاريخ</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="modal-input"
                            dir="ltr"
                            required
                        />
                    </div>

                    {/* Notes */}
                    <div className="modal-field">
                        <label className="modal-label">ملاحظات (اختياري)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="ملاحظات إضافية..."
                            className="modal-input modal-textarea"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="auth-btn auth-btn-secondary" onClick={onClose}>
                            إلغاء
                        </button>
                        <button type="submit" className="auth-btn auth-btn-primary">
                            {expense ? "💾 حفظ التعديل" : "➕ إضافة المصروف"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
