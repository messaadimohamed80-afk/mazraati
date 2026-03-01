import { z } from "zod";

// --- Base Row Shape (shared by all DB tables) ---
const dbRowBase = z.object({
    id: z.string().uuid(),
    farm_id: z.string().uuid(),
    created_at: z.string(),
}).passthrough();

// --- Validations: Expenses ---
export const createExpenseSchema = z.object({
    category_id: z.string().uuid("معرف التصنيف غير صالح"),
    amount: z.number().positive("المبلغ يجب أن يكون أكبر من صفر"),
    currency: z.string().default("TND"),
    description: z.string().min(2, "الوصف قصير جداً").max(200, "الوصف طويل جداً"),
    notes: z.string().max(500, "الملاحظات لا يمكن أن تتجاوز 500 حرف").optional(),
    date: z.string().date("صيغة التاريخ غير صالحة"),
    receipt_url: z.string().url("رابط الإيصال غير صالح").optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
    id: z.string().uuid("رقم المصروف غير صالح"),
});

// --- Validations: Water (Wells, Tanks, Irrigation) ---
export const createWellSchema = z.object({
    name: z.string().min(2, "اسم البئر قصير جداً").max(100),
    depth_meters: z.number().positive("العمق يجب أن يكون أكبر من صفر"),
    water_level_meters: z.number().nonnegative("مستوى المياه لا يمكن أن يكون سالباً").optional(),
    water_quality: z.enum(["fresh", "brackish", "saline"]).default("fresh"),
    status: z.enum(["drilling", "testing", "active", "inactive"]).default("drilling"),
    total_cost: z.number().nonnegative().optional(),
    salinity_ppm: z.number().nonnegative().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export const createTankSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["ground", "elevated", "underground"]),
    capacity_liters: z.number().positive("السعة يجب أن تكون موجبة"),
    current_level_percent: z.number().min(0).max(100),
    source: z.string().min(2),
    status: z.enum(["active", "maintenance", "empty", "inactive"]).default("active"),
    last_filled: z.string().date().optional(),
    notes: z.string().max(500).optional(),
});

export const createIrrigationSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["drip", "sprinkler", "flood", "pivot"]),
    coverage_hectares: z.number().nonnegative(),
    source_id: z.string().uuid().optional(),
    source_name: z.string().min(2),
    status: z.enum(["active", "maintenance", "inactive", "planned"]).default("planned"),
    flow_rate_lph: z.number().nonnegative().optional(),
    last_maintenance: z.string().date().optional(),
    notes: z.string().max(500).optional(),
});

export const updateWellSchema = createWellSchema.partial().extend({
    id: z.string().uuid(),
});

export const updateTankSchema = createTankSchema.partial().extend({
    id: z.string().uuid(),
});

export const updateIrrigationSchema = createIrrigationSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Crops & Tasks ---
export const createCropSchema = z.object({
    crop_type: z.string().min(2).max(100),
    variety: z.string().max(100).optional(),
    field_name: z.string().max(100).optional(),
    area_hectares: z.number().positive("المساحة يجب أن تكون موجبة").optional(),
    planting_date: z.string().date().optional(),
    expected_harvest: z.string().date().optional(),
    actual_harvest: z.string().date().optional(),
    yield_kg: z.number().nonnegative().optional(),
    status: z.enum(["planned", "planted", "growing", "harvested"]).default("planned"),
    current_stage: z.string().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    notes: z.string().max(500).optional(),
});

export const updateCropSchema = createCropSchema.partial().extend({
    id: z.string().uuid(),
});

export const createTaskSchema = z.object({
    crop_id: z.string().uuid().optional(),
    title: z.string().min(2).max(200),
    description: z.string().max(1000).optional(),
    assigned_to: z.string().max(100).optional(),
    due_date: z.string().date().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    status: z.enum(["pending", "in_progress", "done"]).default("pending"),
    recurring: z.boolean().default(false),
    recurrence_rule: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Livestock ---
export const createAnimalSchema = z.object({
    name: z.string().min(2).max(100),
    type: z.enum(["sheep", "cattle", "poultry", "goat"]),
    breed: z.string().max(100),
    gender: z.enum(["male", "female"]),
    birth_date: z.string().date().optional(),
    weight_kg: z.number().positive().optional(),
    tag_number: z.string().min(1).max(100),
    status: z.enum(["healthy", "sick", "pregnant", "sold", "deceased"]).default("healthy"),
    mother_id: z.string().uuid().optional(),
    acquisition_date: z.string().date(),
    acquisition_type: z.enum(["born", "purchased"]),
    purchase_price: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
});

export const updateAnimalSchema = createAnimalSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Inventory ---
export const createInventoryItemSchema = z.object({
    name: z.string().min(2).max(100),
    category: z.enum(["equipment", "chemicals", "seeds", "tools", "supplies", "spare_parts"]),
    quantity: z.number().nonnegative(),
    unit: z.string().min(1).max(50),
    min_stock: z.number().nonnegative(),
    location: z.string().max(200),
    purchase_date: z.string().date(),
    purchase_price: z.number().nonnegative(),
    condition: z.enum(["new", "good", "fair", "needs_repair", "broken"]).default("new"),
    notes: z.string().max(500).optional(),
});

export const updateInventoryItemSchema = createInventoryItemSchema.partial().extend({
    id: z.string().uuid(),
});

// --- Validations: Energy ---
export const createEnergyAssetSchema = z.object({
    name: z.string().min(2).max(100),
    status: z.string(), // Extensively validated in UI
    total_cost: z.number().nonnegative().optional(),
    notes: z.string().max(500).optional(),
});

export const solarPanelRowSchema = dbRowBase.extend({
    name: z.string(),
    capacity_kw: z.number(),
    panel_count: z.number(),
    daily_production_kwh: z.number(),
    efficiency_percent: z.number(),
    installation_date: z.string(),
    inverter_type: z.string(),
    status: z.enum(["active", "maintenance", "inactive"]),
    total_cost: z.number(),
    notes: z.string().optional(),
}).passthrough();

export const electricityMeterRowSchema = dbRowBase.extend({
    name: z.string(),
    meter_number: z.string(),
    provider: z.string(),
    monthly_consumption_kwh: z.number(),
    monthly_cost: z.number(),
    currency: z.string(),
    tariff_type: z.enum(["agricultural", "residential", "commercial"]),
    status: z.enum(["active", "suspended", "disconnected"]),
    last_reading_date: z.string(),
    notes: z.string().optional(),
}).passthrough();

export const generatorRowSchema = dbRowBase.extend({
    name: z.string(),
    fuel_type: z.enum(["diesel", "gasoline", "gas"]),
    capacity_kva: z.number(),
    runtime_hours: z.number(),
    fuel_consumption_lph: z.number(),
    last_maintenance: z.string(),
    next_maintenance_hours: z.number(),
    status: z.enum(["running", "standby", "maintenance", "broken"]),
    total_cost: z.number(),
    notes: z.string().optional(),
}).passthrough();

export const updateSolarPanelSchema = solarPanelRowSchema
    .omit({ farm_id: true, created_at: true })
    .partial()
    .extend({ id: z.string().uuid() });

export const updateElectricityMeterSchema = electricityMeterRowSchema
    .omit({ farm_id: true, created_at: true })
    .partial()
    .extend({ id: z.string().uuid() });

export const updateGeneratorSchema = generatorRowSchema
    .omit({ farm_id: true, created_at: true })
    .partial()
    .extend({ id: z.string().uuid() });

// --- Row Validations (DB Returns) ---

export const cropRowSchema = createCropSchema.extend(dbRowBase.shape).passthrough();
export const taskRowSchema = createTaskSchema.extend(dbRowBase.shape).passthrough();

export const expenseRowSchema = createExpenseSchema.extend(
    dbRowBase.extend({ created_by: z.string().uuid() }).shape
).passthrough();

export const categoryRowSchema = z.object({
    id: z.string().uuid(),
    farm_id: z.string().uuid(),
    name: z.string(),
    icon: z.string(),
    color: z.string(),
    budget_planned: z.number().optional(),
    created_at: z.string(),
}).passthrough();

export const wellRowSchema = createWellSchema.extend(dbRowBase.shape).passthrough();
export const tankRowSchema = createTankSchema.extend(dbRowBase.shape).passthrough();
export const irrigationRowSchema = createIrrigationSchema.extend(dbRowBase.shape).passthrough();
export const wellLayerRowSchema = z.object({
    id: z.string().uuid(),
    well_id: z.string().uuid(),
    depth_from: z.number(),
    depth_to: z.number(),
    layer_type: z.enum(["soil", "rock", "clay", "water", "sand", "gravel"]),
    notes: z.string().optional(),
}).passthrough();

export const animalRowSchema = createAnimalSchema.extend(dbRowBase.shape).passthrough();
export const vaccinationRowSchema = z.object({
    id: z.string().uuid(),
    animal_id: z.string().uuid(),
    vaccine_name: z.string(),
    date: z.string(),
    next_due: z.string().optional(),
    administered_by: z.string().optional(),
    cost: z.number().optional(),
    notes: z.string().optional(),
    created_at: z.string(),
}).passthrough();

export const feedRowSchema = z.object({
    id: z.string().uuid(),
    farm_id: z.string().uuid(),
    feed_type: z.string(),
    quantity_kg: z.number(),
    cost_per_kg: z.number(),
    purchase_date: z.string(),
    remaining_kg: z.number(),
    notes: z.string().optional(),
    created_at: z.string(),
}).passthrough();

export const inventoryItemRowSchema = createInventoryItemSchema.extend(dbRowBase.shape).passthrough();
