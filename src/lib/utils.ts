/* ===== Formatting Utilities ===== */

export function formatCurrency(amount: number, currency: string = "TND"): string {
    const symbols: Record<string, string> = {
        TND: "د.ت",
        DZD: "د.ج",
        SAR: "ر.س",
        EGP: "ج.م",
        MAD: "د.م",
        USD: "$",
    };
    return `${amount.toLocaleString("ar-TN")} ${symbols[currency] || currency}`;
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-TN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatDateRelative(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
    if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`;
    return `منذ ${Math.floor(diffDays / 365)} سنوات`;
}
