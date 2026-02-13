import { Crop, Task } from "./types";

/* ===== Crop Categories ===== */
export const CROP_CATEGORIES = [
    { key: "olive", label: "زيتون", icon: "🫒", color: "#84cc16" },
    { key: "wheat", label: "قمح", icon: "🌾", color: "#f59e0b" },
    { key: "tomato", label: "طماطم", icon: "🍅", color: "#ef4444" },
    { key: "pepper", label: "فلفل", icon: "🌶️", color: "#f97316" },
    { key: "almond", label: "لوز", icon: "🌰", color: "#a3693c" },
    { key: "date", label: "تمر", icon: "🌴", color: "#92400e" },
    { key: "citrus", label: "حمضيات", icon: "🍊", color: "#fb923c" },
    { key: "melon", label: "بطيخ", icon: "🍉", color: "#22c55e" },
];

/* ===== Mock Crops ===== */
export const MOCK_CROPS: Crop[] = [
    {
        id: "crop-1",
        farm_id: "farm-1",
        crop_type: "زيتون",
        variety: "شملالي",
        field_name: "القطعة الشمالية",
        area_hectares: 3.5,
        planting_date: "2020-11-15",
        expected_harvest: "2025-11-01",
        status: "growing",
        current_stage: "fruit_set",
        yield_kg: undefined,
        latitude: 36.7256,
        longitude: 9.1817,
        notes: "180 شجرة — عمر 5 سنوات",
        created_at: "2024-01-01T10:00:00Z",
    },
    {
        id: "crop-2",
        farm_id: "farm-1",
        crop_type: "قمح",
        variety: "قمح صلب — كريم",
        field_name: "القطعة الجنوبية",
        area_hectares: 2.0,
        planting_date: "2024-11-20",
        expected_harvest: "2025-06-15",
        status: "growing",
        current_stage: "heading",
        yield_kg: undefined,
        latitude: 36.7230,
        longitude: 9.1850,
        notes: "بذر مباشر — تسميد بالأمونيتر",
        created_at: "2024-11-20T08:00:00Z",
    },
    {
        id: "crop-3",
        farm_id: "farm-1",
        crop_type: "طماطم",
        variety: "ريو غراندي",
        field_name: "بيت بلاستيكي 1",
        area_hectares: 0.3,
        planting_date: "2025-01-10",
        expected_harvest: "2025-04-15",
        status: "growing",
        current_stage: "fruiting",
        yield_kg: undefined,
        latitude: 36.7265,
        longitude: 9.1790,
        notes: "ري بالتنقيط — 120 شتلة",
        created_at: "2025-01-10T09:00:00Z",
    },
    {
        id: "crop-4",
        farm_id: "farm-1",
        crop_type: "فلفل",
        variety: "فلفل حار",
        field_name: "بيت بلاستيكي 2",
        area_hectares: 0.2,
        planting_date: "2025-01-15",
        expected_harvest: "2025-05-01",
        status: "planted",
        current_stage: "vegetative",
        yield_kg: undefined,
        latitude: 36.7268,
        longitude: 9.1793,
        created_at: "2025-01-15T10:00:00Z",
    },
    {
        id: "crop-5",
        farm_id: "farm-1",
        crop_type: "لوز",
        variety: "مازيتو",
        field_name: "القطعة الغربية",
        area_hectares: 1.5,
        planting_date: "2022-02-10",
        expected_harvest: "2025-08-15",
        status: "growing",
        current_stage: "fruit_growth",
        yield_kg: undefined,
        latitude: 36.7240,
        longitude: 9.1770,
        notes: "60 شجرة — تحتاج تقليم",
        created_at: "2024-01-01T10:00:00Z",
    },
    {
        id: "crop-6",
        farm_id: "farm-1",
        crop_type: "بطيخ",
        variety: "كريمسون سويت",
        field_name: "القطعة الجنوبية",
        area_hectares: 0.5,
        planting_date: "2024-04-01",
        expected_harvest: "2024-07-15",
        actual_harvest: "2024-07-20",
        status: "harvested",
        current_stage: "harvest",
        yield_kg: 2800,
        latitude: 36.7230,
        longitude: 9.1855,
        notes: "موسم ممتاز — 2.8 طن",
        created_at: "2024-04-01T08:00:00Z",
    },
    {
        id: "crop-7",
        farm_id: "farm-1",
        crop_type: "حمضيات",
        variety: "برتقال مالطي",
        field_name: "الحديقة",
        area_hectares: 0.4,
        planting_date: "",
        expected_harvest: "",
        status: "planned",
        current_stage: "dormancy",
        yield_kg: undefined,
        latitude: 36.7260,
        longitude: 9.1830,
        notes: "مخطط لموسم الخريف",
        created_at: "2025-02-01T10:00:00Z",
    },
];

/* ===== Mock Tasks ===== */
export const MOCK_TASKS: Task[] = [
    {
        id: "task-1",
        farm_id: "farm-1",
        title: "تقليم أشجار الزيتون",
        description: "تقليم الأغصان الميتة والمتقاطعة لتحسين الإنتاج",
        assigned_to: "عامل 1",
        due_date: "2025-02-15",
        completed_at: undefined,
        priority: "high",
        status: "in_progress",
        recurring: true,
        recurrence_rule: "سنوياً — فبراير",
        created_at: "2025-02-01T08:00:00Z",
    },
    {
        id: "task-2",
        farm_id: "farm-1",
        title: "صيانة مولد الري المحمول",
        description: "تغيير فلتر الزيت وفحص البوجيهات",
        assigned_to: "عامل 2",
        due_date: "2025-02-12",
        completed_at: undefined,
        priority: "urgent",
        status: "pending",
        recurring: false,
        created_at: "2025-02-05T10:00:00Z",
    },
    {
        id: "task-3",
        farm_id: "farm-1",
        title: "تسميد القمح — الجرعة الثانية",
        description: "إضافة أمونيتر 33% بمعدل 1.5 قنطار/هكتار",
        assigned_to: "عامل 1",
        due_date: "2025-02-20",
        completed_at: undefined,
        priority: "high",
        status: "pending",
        recurring: false,
        created_at: "2025-02-08T09:00:00Z",
    },
    {
        id: "task-4",
        farm_id: "farm-1",
        title: "فحص شبكة الري بالتنقيط",
        description: "تنظيف الفلاتر وفحص النقاطات المسدودة",
        assigned_to: "عامل 2",
        due_date: "2025-02-18",
        completed_at: undefined,
        priority: "medium",
        status: "pending",
        recurring: true,
        recurrence_rule: "كل شهرين",
        created_at: "2025-02-01T11:00:00Z",
    },
    {
        id: "task-5",
        farm_id: "farm-1",
        title: "رش مبيد حشري — الطماطم",
        description: "رش وقائي ضد التوتا أبسولوتا",
        assigned_to: "عامل 1",
        due_date: "2025-02-10",
        completed_at: "2025-02-10T14:30:00Z",
        priority: "high",
        status: "done",
        recurring: true,
        recurrence_rule: "كل أسبوعين",
        created_at: "2025-02-05T08:00:00Z",
    },
    {
        id: "task-6",
        farm_id: "farm-1",
        title: "تنظيف الألواح الشمسية",
        description: "غسل الألواح بالماء لتحسين الكفاءة",
        assigned_to: "عامل 2",
        due_date: "2025-02-08",
        completed_at: "2025-02-08T16:00:00Z",
        priority: "low",
        status: "done",
        recurring: true,
        recurrence_rule: "شهرياً",
        created_at: "2025-02-01T07:00:00Z",
    },
    {
        id: "task-7",
        farm_id: "farm-1",
        title: "شراء بذور فلفل حار",
        description: "طلب بذور من المشتل — صنف هاريسا",
        due_date: "2025-02-25",
        completed_at: undefined,
        priority: "low",
        status: "pending",
        recurring: false,
        created_at: "2025-02-09T10:00:00Z",
    },
    {
        id: "task-8",
        farm_id: "farm-1",
        title: "قراءة عداد الكهرباء",
        description: "تسجيل القراءة الشهرية للعداد الرئيسي والمسكن",
        assigned_to: "عامل 1",
        due_date: "2025-03-01",
        completed_at: undefined,
        priority: "medium",
        status: "pending",
        recurring: true,
        recurrence_rule: "شهرياً — أول الشهر",
        created_at: "2025-02-01T08:00:00Z",
    },
];

/* ===== Status Maps ===== */
export const CROP_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    planned: { label: "مخطط", color: "#3b82f6", icon: "📋" },
    planted: { label: "مزروع", color: "#8b5cf6", icon: "🌱" },
    growing: { label: "ينمو", color: "#10b981", icon: "🌿" },
    harvested: { label: "تم الحصاد", color: "#f59e0b", icon: "✅" },
};

/* ===== Crop Phenology Stages (per crop type) ===== */
export interface PhenologyStage {
    key: string;
    label: string;
    emoji: string;
    description: string;
}

export const CROP_PHENOLOGY_STAGES: Record<string, PhenologyStage[]> = {
    "زيتون": [
        { key: "dormancy", label: "السكون", emoji: "🌳", description: "فترة السكون الشتوي — الشجرة في راحة" },
        { key: "budding", label: "التبرعم", emoji: "🌿", description: "ظهور البراعم الجديدة مع بداية الربيع" },
        { key: "flowering", label: "الإزهار", emoji: "🌸", description: "تفتح الأزهار البيضاء في عناقيد" },
        { key: "pollination", label: "التلقيح", emoji: "🐝", description: "تلقيح الأزهار بواسطة الرياح والحشرات" },
        { key: "fruit_set", label: "العقد", emoji: "🫒", description: "تكوّن الثمار الصغيرة بعد التلقيح" },
        { key: "pit_hardening", label: "تصلب النواة", emoji: "💪", description: "تصلب نواة الزيتون داخل الثمرة" },
        { key: "ripening", label: "النضج", emoji: "🟤", description: "تحول لون الثمار من أخضر إلى بنفسجي" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "قطف الزيتون للعصر أو التخليل" },
    ],
    "قمح": [
        { key: "germination", label: "الإنبات", emoji: "🌱", description: "نمو الجذير والبادرة من البذرة" },
        { key: "tillering", label: "الإشطاء", emoji: "🌿", description: "ظهور الأشطاء الجانبية من قاعدة النبتة" },
        { key: "elongation", label: "الاستطالة", emoji: "📏", description: "استطالة الساق وظهور العُقد" },
        { key: "heading", label: "الإسبال", emoji: "🌾", description: "خروج السنبلة من غمد الورقة" },
        { key: "flowering", label: "الإزهار", emoji: "🌼", description: "ظهور المتك وحدوث التلقيح" },
        { key: "milk_ripe", label: "النضج اللبني", emoji: "🥛", description: "الحبوب لينة وتحتوي سائلاً أبيض" },
        { key: "dough_ripe", label: "النضج العجيني", emoji: "🍞", description: "الحبوب تتصلب وتصبح عجينية" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "نضج كامل — جاهز للحصد" },
    ],
    "طماطم": [
        { key: "germination", label: "الإنبات", emoji: "🌱", description: "ظهور البادرة والفلقات" },
        { key: "vegetative", label: "نمو خضري", emoji: "🌿", description: "نمو الأوراق والسيقان" },
        { key: "flowering", label: "الإزهار", emoji: "🌼", description: "ظهور الأزهار الصفراء" },
        { key: "fruiting", label: "الإثمار", emoji: "🟢", description: "تكوّن الثمار الخضراء" },
        { key: "ripening", label: "النضج", emoji: "🔴", description: "تحول الثمار إلى اللون الأحمر" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "قطف الثمار الناضجة" },
    ],
    "فلفل": [
        { key: "germination", label: "الإنبات", emoji: "🌱", description: "ظهور البادرة والفلقات" },
        { key: "vegetative", label: "نمو خضري", emoji: "🌿", description: "نمو الأوراق والتفرع" },
        { key: "flowering", label: "الإزهار", emoji: "🌼", description: "ظهور الأزهار البيضاء" },
        { key: "fruiting", label: "الإثمار", emoji: "🟢", description: "تكوّن ثمار الفلفل الخضراء" },
        { key: "ripening", label: "النضج", emoji: "🌶️", description: "تلوّن الثمار واكتمال الحرارة" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "قطف الثمار الناضجة" },
    ],
    "لوز": [
        { key: "dormancy", label: "السكون", emoji: "🌳", description: "فترة الراحة الشتوية" },
        { key: "budding", label: "التبرعم", emoji: "🌿", description: "انتفاخ البراعم الزهرية" },
        { key: "flowering", label: "الإزهار", emoji: "🌸", description: "تفتح الأزهار الوردية البيضاء" },
        { key: "fruit_set", label: "العقد", emoji: "🟢", description: "تكوّن الثمار بعد التلقيح" },
        { key: "fruit_growth", label: "نمو الثمرة", emoji: "🥜", description: "نمو القشرة وتكوّن اللوزة" },
        { key: "ripening", label: "النضج", emoji: "🟤", description: "جفاف القشرة الخارجية وانشقاقها" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "جمع اللوز وتجفيفه" },
    ],
    "حمضيات": [
        { key: "dormancy", label: "السكون", emoji: "🌳", description: "فترة السكون الشتوي" },
        { key: "budding", label: "التبرعم", emoji: "🌿", description: "ظهور البراعم الزهرية والورقية" },
        { key: "flowering", label: "الإزهار", emoji: "🌸", description: "تفتح الأزهار البيضاء العطرة" },
        { key: "fruit_set", label: "العقد", emoji: "🟢", description: "تكوّن الثمار الصغيرة" },
        { key: "fruit_growth", label: "نمو الثمرة", emoji: "🍊", description: "نمو الثمرة وزيادة حجمها" },
        { key: "coloring", label: "تلوين الثمرة", emoji: "🟠", description: "تحول الثمرة من أخضر إلى برتقالي" },
        { key: "ripening", label: "النضج", emoji: "🧺", description: "اكتمال النضج وجاهزية الحصاد" },
    ],
    "بطيخ": [
        { key: "germination", label: "الإنبات", emoji: "🌱", description: "نمو الجذر وظهور الفلقات" },
        { key: "vegetative", label: "نمو خضري", emoji: "🌿", description: "نمو الأوراق الحقيقية" },
        { key: "branching", label: "التفريع", emoji: "🌊", description: "امتداد العرائش والأفرع الجانبية" },
        { key: "flowering", label: "الإزهار", emoji: "🌼", description: "ظهور الأزهار المذكرة والمؤنثة" },
        { key: "fruiting", label: "الإثمار", emoji: "🟢", description: "تكوّن الثمار بعد التلقيح" },
        { key: "ripening", label: "النضج", emoji: "🍉", description: "اكتمال حجم الثمرة ونضجها" },
        { key: "harvest", label: "الحصاد", emoji: "🧺", description: "قطف البطيخ الناضج" },
    ],
};

/* Default / generic fallback */
export const DEFAULT_PHENOLOGY_STAGES: PhenologyStage[] = [
    { key: "planned", label: "مخطط", emoji: "📋", description: "مرحلة التخطيط" },
    { key: "planted", label: "مزروع", emoji: "🌱", description: "تمت الزراعة" },
    { key: "growing", label: "ينمو", emoji: "🌿", description: "مرحلة النمو" },
    { key: "harvested", label: "تم الحصاد", emoji: "🧺", description: "تم جمع المحصول" },
];

export function getCropPhenologyStages(cropType: string): PhenologyStage[] {
    return CROP_PHENOLOGY_STAGES[cropType] || DEFAULT_PHENOLOGY_STAGES;
}

export const TASK_PRIORITY_MAP: Record<string, { label: string; color: string; icon: string }> = {
    low: { label: "منخفضة", color: "#64748b", icon: "🔵" },
    medium: { label: "متوسطة", color: "#f59e0b", icon: "🟡" },
    high: { label: "عالية", color: "#f97316", icon: "🟠" },
    urgent: { label: "عاجلة", color: "#ef4444", icon: "🔴" },
};

export const TASK_STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "#64748b" },
    in_progress: { label: "جاري التنفيذ", color: "#3b82f6" },
    done: { label: "مكتمل", color: "#10b981" },
};

/* ===== Helpers ===== */
export function getCropIcon(cropType: string): string {
    const cat = CROP_CATEGORIES.find((c) => c.label === cropType);
    return cat?.icon || "🌱";
}

export function getCropColor(cropType: string): string {
    const cat = CROP_CATEGORIES.find((c) => c.label === cropType);
    return cat?.color || "#10b981";
}

export function getDaysUntil(dateStr: string): number {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateStr?: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
}
