/* ===== Livestock Types ===== */

export interface Animal {
    id: string;
    farm_id: string;
    name: string;
    type: "sheep" | "cattle" | "poultry" | "goat";
    breed: string;
    gender: "male" | "female";
    birth_date?: string;
    weight_kg?: number;
    tag_number: string;
    status: "healthy" | "sick" | "pregnant" | "sold" | "deceased";
    mother_id?: string;
    acquisition_date: string;
    acquisition_type: "born" | "purchased";
    purchase_price?: number;
    notes?: string;
    created_at: string;
}

export interface VaccinationRecord {
    id: string;
    animal_id: string;
    vaccine_name: string;
    date: string;
    next_due?: string;
    administered_by?: string;
    cost?: number;
    notes?: string;
    created_at: string;
}

export interface FeedRecord {
    id: string;
    farm_id: string;
    feed_type: string;
    quantity_kg: number;
    cost_per_kg: number;
    purchase_date: string;
    remaining_kg: number;
    notes?: string;
    created_at: string;
}

/* ===== Mock Data ===== */

export const MOCK_ANIMALS: Animal[] = [
    {
        id: "animal-1",
        farm_id: "farm-1",
        name: "كبش SH-001",
        type: "sheep",
        breed: "بربرية",
        gender: "male",
        birth_date: "2022-03-15",
        weight_kg: 85,
        tag_number: "SH-001",
        status: "healthy",
        acquisition_date: "2022-03-15",
        acquisition_type: "born",
        notes: "كبش للتربية — ممتاز",
        created_at: "2022-03-15T10:00:00Z",
    },
    {
        id: "animal-2",
        farm_id: "farm-1",
        name: "نعجة SH-002",
        type: "sheep",
        breed: "بربرية",
        gender: "female",
        birth_date: "2021-09-10",
        weight_kg: 62,
        tag_number: "SH-002",
        status: "pregnant",
        acquisition_date: "2023-01-20",
        acquisition_type: "purchased",
        purchase_price: 450,
        notes: "حامل — ولادة متوقعة مارس 2026",
        created_at: "2023-01-20T09:00:00Z",
    },
    {
        id: "animal-3",
        farm_id: "farm-1",
        name: "نعجة SH-003",
        type: "sheep",
        breed: "سردي",
        gender: "female",
        birth_date: "2022-06-01",
        weight_kg: 58,
        tag_number: "SH-003",
        status: "healthy",
        acquisition_date: "2022-06-01",
        acquisition_type: "born",
        created_at: "2022-06-01T08:00:00Z",
    },
    {
        id: "animal-4",
        farm_id: "farm-1",
        name: "حمل SH-004",
        type: "sheep",
        breed: "بربرية",
        gender: "male",
        birth_date: "2025-11-05",
        weight_kg: 18,
        tag_number: "SH-004",
        status: "healthy",
        mother_id: "animal-3",
        acquisition_date: "2025-11-05",
        acquisition_type: "born",
        notes: "خروف — نمو جيد",
        created_at: "2025-11-05T07:00:00Z",
    },
    {
        id: "animal-5",
        farm_id: "farm-1",
        name: "بقرة CT-001",
        type: "cattle",
        breed: "هولشتاين",
        gender: "female",
        birth_date: "2020-04-20",
        weight_kg: 520,
        tag_number: "CT-001",
        status: "healthy",
        acquisition_date: "2023-06-15",
        acquisition_type: "purchased",
        purchase_price: 3200,
        notes: "بقرة حلوب — 15 لتر/يوم",
        created_at: "2023-06-15T10:00:00Z",
    },
    {
        id: "animal-6",
        farm_id: "farm-1",
        name: "عجل CT-002",
        type: "cattle",
        breed: "هولشتاين",
        gender: "male",
        birth_date: "2025-08-12",
        weight_kg: 180,
        tag_number: "CT-002",
        status: "healthy",
        mother_id: "animal-5",
        acquisition_date: "2025-08-12",
        acquisition_type: "born",
        notes: "عجل — للتسمين",
        created_at: "2025-08-12T06:00:00Z",
    },
    {
        id: "animal-7",
        farm_id: "farm-1",
        name: "دجاج PL-LOT1",
        type: "poultry",
        breed: "بلدي",
        gender: "female",
        weight_kg: 2.5,
        tag_number: "PL-LOT1",
        status: "healthy",
        acquisition_date: "2024-09-01",
        acquisition_type: "purchased",
        purchase_price: 300,
        notes: "مجموعة 25 دجاجة بيّاضة",
        created_at: "2024-09-01T08:00:00Z",
    },
    {
        id: "animal-8",
        farm_id: "farm-1",
        name: "تيس GT-001",
        type: "goat",
        breed: "جبلية",
        gender: "male",
        birth_date: "2023-02-10",
        weight_kg: 45,
        tag_number: "GT-001",
        status: "healthy",
        acquisition_date: "2024-03-20",
        acquisition_type: "purchased",
        purchase_price: 280,
        created_at: "2024-03-20T09:00:00Z",
    },
    {
        id: "animal-9",
        farm_id: "farm-1",
        name: "نعجة SH-005",
        type: "sheep",
        breed: "سردي",
        gender: "female",
        birth_date: "2023-01-15",
        weight_kg: 55,
        tag_number: "SH-005",
        status: "sick",
        acquisition_date: "2023-01-15",
        acquisition_type: "born",
        notes: "تحت المراقبة — حمى خفيفة",
        created_at: "2023-01-15T08:00:00Z",
    },
    {
        id: "animal-10",
        farm_id: "farm-1",
        name: "كبش SH-006",
        type: "sheep",
        breed: "بربرية",
        gender: "male",
        birth_date: "2024-05-20",
        weight_kg: 42,
        tag_number: "SH-006",
        status: "sold",
        acquisition_date: "2024-05-20",
        acquisition_type: "born",
        notes: "بيع في عيد الأضحى 2025",
        created_at: "2024-05-20T07:00:00Z",
    },
];

export const MOCK_VACCINATIONS: VaccinationRecord[] = [
    {
        id: "vax-1",
        animal_id: "animal-1",
        vaccine_name: "لقاح الحمى القلاعية",
        date: "2025-09-15",
        next_due: "2026-03-15",
        administered_by: "طبيب بيطري",
        cost: 25,
        created_at: "2025-09-15T10:00:00Z",
    },
    {
        id: "vax-2",
        animal_id: "animal-2",
        vaccine_name: "لقاح الجدري",
        date: "2025-10-01",
        next_due: "2026-04-01",
        administered_by: "طبيب بيطري",
        cost: 20,
        created_at: "2025-10-01T10:00:00Z",
    },
    {
        id: "vax-3",
        animal_id: "animal-5",
        vaccine_name: "لقاح البروسيلا",
        date: "2025-07-20",
        next_due: "2026-01-20",
        administered_by: "طبيب بيطري",
        cost: 45,
        notes: "جرعة تذكيرية",
        created_at: "2025-07-20T10:00:00Z",
    },
    {
        id: "vax-4",
        animal_id: "animal-3",
        vaccine_name: "لقاح التسمم المعوي",
        date: "2025-11-10",
        next_due: "2026-05-10",
        administered_by: "طبيب بيطري",
        cost: 18,
        created_at: "2025-11-10T10:00:00Z",
    },
    {
        id: "vax-5",
        animal_id: "animal-7",
        vaccine_name: "لقاح نيوكاسل",
        date: "2025-12-01",
        next_due: "2026-03-01",
        administered_by: "طبيب بيطري",
        cost: 15,
        notes: "المجموعة كاملة",
        created_at: "2025-12-01T10:00:00Z",
    },
];

export const MOCK_FEED: FeedRecord[] = [
    {
        id: "feed-1",
        farm_id: "farm-1",
        feed_type: "شعير",
        quantity_kg: 500,
        cost_per_kg: 0.8,
        purchase_date: "2025-01-10",
        remaining_kg: 180,
        notes: "علف أساسي للأغنام",
        created_at: "2025-01-10T10:00:00Z",
    },
    {
        id: "feed-2",
        farm_id: "farm-1",
        feed_type: "نخالة القمح",
        quantity_kg: 200,
        cost_per_kg: 0.5,
        purchase_date: "2025-01-20",
        remaining_kg: 85,
        created_at: "2025-01-20T10:00:00Z",
    },
    {
        id: "feed-3",
        farm_id: "farm-1",
        feed_type: "علف مركّز للأبقار",
        quantity_kg: 300,
        cost_per_kg: 1.2,
        purchase_date: "2025-02-01",
        remaining_kg: 220,
        notes: "علف عالي البروتين",
        created_at: "2025-02-01T10:00:00Z",
    },
    {
        id: "feed-4",
        farm_id: "farm-1",
        feed_type: "ذرة مطحونة",
        quantity_kg: 150,
        cost_per_kg: 0.9,
        purchase_date: "2025-01-25",
        remaining_kg: 40,
        notes: "مستوى منخفض — يجب إعادة الشراء",
        created_at: "2025-01-25T10:00:00Z",
    },
    {
        id: "feed-5",
        farm_id: "farm-1",
        feed_type: "علف دواجن",
        quantity_kg: 100,
        cost_per_kg: 1.1,
        purchase_date: "2025-02-05",
        remaining_kg: 65,
        created_at: "2025-02-05T10:00:00Z",
    },
];

/* ===== Helper Maps ===== */

export const ANIMAL_TYPE_MAP: Record<string, { label: string; icon: string; color: string }> = {
    sheep: { label: "أغنام", icon: "🐑", color: "#8b5cf6" },
    cattle: { label: "أبقار", icon: "🐄", color: "#f59e0b" },
    poultry: { label: "دواجن", icon: "🐔", color: "#ec4899" },
    goat: { label: "ماعز", icon: "🐐", color: "#06b6d4" },
};

export const ANIMAL_STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
    healthy: { label: "بصحة جيدة", color: "#10b981", icon: "✅" },
    sick: { label: "مريض", color: "#ef4444", icon: "🤒" },
    pregnant: { label: "حامل", color: "#8b5cf6", icon: "🤰" },
    sold: { label: "مباع", color: "#64748b", icon: "💰" },
    deceased: { label: "نافق", color: "#374151", icon: "⚫" },
};

export const GENDER_MAP: Record<string, { label: string; icon: string }> = {
    male: { label: "ذكر", icon: "♂️" },
    female: { label: "أنثى", icon: "♀️" },
};
