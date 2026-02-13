import { Expense, Category } from "./types";

/* ===== Categories ===== */
export const MOCK_CATEGORIES: Category[] = [
    {
        id: "cat-1",
        farm_id: "farm-1",
        name: "حفر الآبار",
        icon: "⛏️",
        color: "#ef4444",
        budget_planned: 35000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-9",
        farm_id: "farm-1",
        name: "طاقة",
        icon: "⚡",
        color: "#f97316",
        budget_planned: 10000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-2",
        farm_id: "farm-1",
        name: "بذور وأسمدة",
        icon: "🌱",
        color: "#10b981",
        budget_planned: 8000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-3",
        farm_id: "farm-1",
        name: "معدات",
        icon: "🔧",
        color: "#3b82f6",
        budget_planned: 15000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-4",
        farm_id: "farm-1",
        name: "عمالة",
        icon: "👷",
        color: "#f59e0b",
        budget_planned: 12000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-5",
        farm_id: "farm-1",
        name: "نقل",
        icon: "🚛",
        color: "#8b5cf6",
        budget_planned: 5000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-6",
        farm_id: "farm-1",
        name: "فحوصات",
        icon: "🔬",
        color: "#06b6d4",
        budget_planned: 3000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-7",
        farm_id: "farm-1",
        name: "وقود ومحروقات",
        icon: "⛽",
        color: "#ec4899",
        budget_planned: 6000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "cat-8",
        farm_id: "farm-1",
        name: "أخرى",
        icon: "📦",
        color: "#64748b",
        budget_planned: 5000,
        created_at: "2023-01-01T00:00:00Z",
    },
];

/* ===== Expenses ===== */
export const MOCK_EXPENSES: Expense[] = [
    {
        id: "exp-1",
        farm_id: "farm-1",
        category_id: "cat-1",
        amount: 34200,
        currency: "TND",
        description: "حفر البئر — المرحلة الأولى",
        notes: "تحويل بنكي",
        date: "2025-01-23",
        created_by: "user-1",
        created_at: "2025-01-23T10:00:00Z",
        category: MOCK_CATEGORIES[0],
    },
    {
        id: "exp-2",
        farm_id: "farm-1",
        category_id: "cat-1",
        amount: 8600,
        currency: "TND",
        description: "حفر البئر — المرحلة الثانية",
        notes: "تحويل بنكي دولي",
        date: "2024-12-26",
        created_by: "user-1",
        created_at: "2024-12-26T14:00:00Z",
        category: MOCK_CATEGORIES[0],
    },
    {
        id: "exp-3",
        farm_id: "farm-1",
        category_id: "cat-2",
        amount: 5100,
        currency: "TND",
        description: "بذور الحمص + أسمدة",
        notes: "شراء من سوق المدينة",
        date: "2024-12-01",
        created_by: "user-1",
        created_at: "2024-12-01T09:00:00Z",
        category: MOCK_CATEGORIES[1],
    },
    {
        id: "exp-4",
        farm_id: "farm-1",
        category_id: "cat-6",
        amount: 2500,
        currency: "TND",
        description: "فحص التربة — السكانار",
        notes: "فحص التربة والموقع",
        date: "2023-10-11",
        created_by: "user-1",
        created_at: "2023-10-11T11:00:00Z",
        category: MOCK_CATEGORIES[5],
    },
    {
        id: "exp-5",
        farm_id: "farm-1",
        category_id: "cat-3",
        amount: 7800,
        currency: "TND",
        description: "مضخة مياه غاطسة",
        notes: "مضخة لوارا إيطالية",
        date: "2025-02-01",
        created_by: "user-1",
        created_at: "2025-02-01T08:00:00Z",
        category: MOCK_CATEGORIES[2],
    },
    {
        id: "exp-6",
        farm_id: "farm-1",
        category_id: "cat-4",
        amount: 3200,
        currency: "TND",
        description: "أجرة عمال — تنظيف الأرض",
        notes: "3 عمال × يوم واحد",
        date: "2025-01-15",
        created_by: "user-1",
        created_at: "2025-01-15T07:00:00Z",
        category: MOCK_CATEGORIES[3],
    },
    {
        id: "exp-7",
        farm_id: "farm-1",
        category_id: "cat-5",
        amount: 1800,
        currency: "TND",
        description: "نقل المعدات للمزرعة",
        notes: "شاحنة صغيرة",
        date: "2025-01-20",
        created_by: "user-1",
        created_at: "2025-01-20T12:00:00Z",
        category: MOCK_CATEGORIES[4],
    },
    {
        id: "exp-8",
        farm_id: "farm-1",
        category_id: "cat-7",
        amount: 2400,
        currency: "TND",
        description: "وقود المولد الكهربائي",
        notes: "60 لتر بنزين",
        date: "2025-02-05",
        created_by: "user-1",
        created_at: "2025-02-05T15:00:00Z",
        category: MOCK_CATEGORIES[6],
    },
    {
        id: "exp-9",
        farm_id: "farm-1",
        category_id: "cat-2",
        amount: 3400,
        currency: "TND",
        description: "شتلات زيتون — 20 شتلة",
        notes: "شتلات عمرها سنتين",
        date: "2025-01-10",
        created_by: "user-1",
        created_at: "2025-01-10T10:00:00Z",
        category: MOCK_CATEGORIES[1],
    },
    {
        id: "exp-10",
        farm_id: "farm-1",
        category_id: "cat-8",
        amount: 1500,
        currency: "TND",
        description: "مصاريف إدارية متنوعة",
        notes: "طوابع + نسخ وثائق",
        date: "2025-02-08",
        created_by: "user-1",
        created_at: "2025-02-08T13:00:00Z",
        category: MOCK_CATEGORIES[7],
    },
];

/* ===== Helpers ===== */
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
