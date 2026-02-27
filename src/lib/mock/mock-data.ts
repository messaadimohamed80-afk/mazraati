import { Expense, Category } from "../types";

/* ===== Categories ===== */
export const MOCK_CATEGORIES: Category[] = [
    {
        id: "00000000-0000-0000-0000-00000000a001",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ø­ÙØ± Ø§Ù„Ø¢Ø¨Ø§Ø±",
        icon: "â›ï¸",
        color: "#ef4444",
        budget_planned: 35000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a009",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ø·Ø§Ù‚Ø©",
        icon: "âš¡",
        color: "#f97316",
        budget_planned: 10000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a002",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ø¨Ø°ÙˆØ± ÙˆØ£Ø³Ù…Ø¯Ø©",
        icon: "ðŸŒ±",
        color: "#10b981",
        budget_planned: 8000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a003",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ù…Ø¹Ø¯Ø§Øª",
        icon: "ðŸ”§",
        color: "#3b82f6",
        budget_planned: 15000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a004",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ø¹Ù…Ø§Ù„Ø©",
        icon: "ðŸ‘·",
        color: "#f59e0b",
        budget_planned: 12000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a005",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ù†Ù‚Ù„",
        icon: "ðŸš›",
        color: "#8b5cf6",
        budget_planned: 5000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a006",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "ÙØ­ÙˆØµØ§Øª",
        icon: "ðŸ”¬",
        color: "#06b6d4",
        budget_planned: 3000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a007",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "ÙˆÙ‚ÙˆØ¯ ÙˆÙ…Ø­Ø±ÙˆÙ‚Ø§Øª",
        icon: "â›½",
        color: "#ec4899",
        budget_planned: 6000,
        created_at: "2023-01-01T00:00:00Z",
    },
    {
        id: "00000000-0000-0000-0000-00000000a008",
        farm_id: "00000000-0000-0000-0000-000000000010",
        name: "Ø£Ø®Ø±Ù‰",
        icon: "ðŸ“¦",
        color: "#64748b",
        budget_planned: 5000,
        created_at: "2023-01-01T00:00:00Z",
    },
];

/* ===== Expenses ===== */
export const MOCK_EXPENSES: Expense[] = [
    {
        id: "00000000-0000-0000-0000-0000000b001",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a001",
        amount: 34200,
        currency: "TND",
        description: "Ø­ÙØ± Ø§Ù„Ø¨Ø¦Ø± â€” Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø£ÙˆÙ„Ù‰",
        notes: "ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ",
        date: "2025-01-23",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-01-23T10:00:00Z",
        category: MOCK_CATEGORIES[0],
    },
    {
        id: "00000000-0000-0000-0000-0000000b002",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a001",
        amount: 8600,
        currency: "TND",
        description: "Ø­ÙØ± Ø§Ù„Ø¨Ø¦Ø± â€” Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ø§Ù„Ø«Ø§Ù†ÙŠØ©",
        notes: "ØªØ­ÙˆÙŠÙ„ Ø¨Ù†ÙƒÙŠ Ø¯ÙˆÙ„ÙŠ",
        date: "2024-12-26",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2024-12-26T14:00:00Z",
        category: MOCK_CATEGORIES[0],
    },
    {
        id: "00000000-0000-0000-0000-0000000b003",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a002",
        amount: 5100,
        currency: "TND",
        description: "Ø¨Ø°ÙˆØ± Ø§Ù„Ø­Ù…Øµ + Ø£Ø³Ù…Ø¯Ø©",
        notes: "Ø´Ø±Ø§Ø¡ Ù…Ù† Ø³ÙˆÙ‚ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        date: "2024-12-01",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2024-12-01T09:00:00Z",
        category: MOCK_CATEGORIES[1],
    },
    {
        id: "00000000-0000-0000-0000-0000000b004",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a006",
        amount: 2500,
        currency: "TND",
        description: "ÙØ­Øµ Ø§Ù„ØªØ±Ø¨Ø© â€” Ø§Ù„Ø³ÙƒØ§Ù†Ø§Ø±",
        notes: "ÙØ­Øµ Ø§Ù„ØªØ±Ø¨Ø© ÙˆØ§Ù„Ù…ÙˆÙ‚Ø¹",
        date: "2023-10-11",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2023-10-11T11:00:00Z",
        category: MOCK_CATEGORIES[5],
    },
    {
        id: "00000000-0000-0000-0000-0000000b005",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a003",
        amount: 7800,
        currency: "TND",
        description: "Ù…Ø¶Ø®Ø© Ù…ÙŠØ§Ù‡ ØºØ§Ø·Ø³Ø©",
        notes: "Ù…Ø¶Ø®Ø© Ù„ÙˆØ§Ø±Ø§ Ø¥ÙŠØ·Ø§Ù„ÙŠØ©",
        date: "2025-02-01",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-02-01T08:00:00Z",
        category: MOCK_CATEGORIES[2],
    },
    {
        id: "00000000-0000-0000-0000-0000000b006",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a004",
        amount: 3200,
        currency: "TND",
        description: "Ø£Ø¬Ø±Ø© Ø¹Ù…Ø§Ù„ â€” ØªÙ†Ø¸ÙŠÙ Ø§Ù„Ø£Ø±Ø¶",
        notes: "3 Ø¹Ù…Ø§Ù„ Ã— ÙŠÙˆÙ… ÙˆØ§Ø­Ø¯",
        date: "2025-01-15",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-01-15T07:00:00Z",
        category: MOCK_CATEGORIES[3],
    },
    {
        id: "00000000-0000-0000-0000-0000000b007",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a005",
        amount: 1800,
        currency: "TND",
        description: "Ù†Ù‚Ù„ Ø§Ù„Ù…Ø¹Ø¯Ø§Øª Ù„Ù„Ù…Ø²Ø±Ø¹Ø©",
        notes: "Ø´Ø§Ø­Ù†Ø© ØµØºÙŠØ±Ø©",
        date: "2025-01-20",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-01-20T12:00:00Z",
        category: MOCK_CATEGORIES[4],
    },
    {
        id: "00000000-0000-0000-0000-0000000b008",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a007",
        amount: 2400,
        currency: "TND",
        description: "ÙˆÙ‚ÙˆØ¯ Ø§Ù„Ù…ÙˆÙ„Ø¯ Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠ",
        notes: "60 Ù„ØªØ± Ø¨Ù†Ø²ÙŠÙ†",
        date: "2025-02-05",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-02-05T15:00:00Z",
        category: MOCK_CATEGORIES[6],
    },
    {
        id: "00000000-0000-0000-0000-0000000b009",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a002",
        amount: 3400,
        currency: "TND",
        description: "Ø´ØªÙ„Ø§Øª Ø²ÙŠØªÙˆÙ† â€” 20 Ø´ØªÙ„Ø©",
        notes: "Ø´ØªÙ„Ø§Øª Ø¹Ù…Ø±Ù‡Ø§ Ø³Ù†ØªÙŠÙ†",
        date: "2025-01-10",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-01-10T10:00:00Z",
        category: MOCK_CATEGORIES[1],
    },
    {
        id: "00000000-0000-0000-0000-0000000b010",
        farm_id: "00000000-0000-0000-0000-000000000010",
        category_id: "00000000-0000-0000-0000-00000000a008",
        amount: 1500,
        currency: "TND",
        description: "Ù…ØµØ§Ø±ÙŠÙ Ø¥Ø¯Ø§Ø±ÙŠØ© Ù…ØªÙ†ÙˆØ¹Ø©",
        notes: "Ø·ÙˆØ§Ø¨Ø¹ + Ù†Ø³Ø® ÙˆØ«Ø§Ø¦Ù‚",
        date: "2025-02-08",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_at: "2025-02-08T13:00:00Z",
        category: MOCK_CATEGORIES[7],
    },
];

/* ===== Helpers ===== */
export function formatCurrency(amount: number, currency: string = "TND"): string {
    const symbols: Record<string, string> = {
        TND: "Ø¯.Øª",
        DZD: "Ø¯.Ø¬",
        SAR: "Ø±.Ø³",
        EGP: "Ø¬.Ù…",
        MAD: "Ø¯.Ù…",
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

    if (diffDays === 0) return "Ø§Ù„ÙŠÙˆÙ…";
    if (diffDays === 1) return "Ø£Ù…Ø³";
    if (diffDays < 7) return `Ù…Ù†Ø° ${diffDays} Ø£ÙŠØ§Ù…`;
    if (diffDays < 30) return `Ù…Ù†Ø° ${Math.floor(diffDays / 7)} Ø£Ø³Ø§Ø¨ÙŠØ¹`;
    if (diffDays < 365) return `Ù…Ù†Ø° ${Math.floor(diffDays / 30)} Ø£Ø´Ù‡Ø±`;
    return `Ù…Ù†Ø° ${Math.floor(diffDays / 365)} Ø³Ù†ÙˆØ§Øª`;
}
