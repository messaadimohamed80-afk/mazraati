-- ============================================================
-- مزرعتي (Mazraati) — Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CORE: profiles, farms, farm_members
-- ============================================================

CREATE TABLE profiles (
    id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   text NOT NULL,
    phone       text,
    avatar_url  text,
    preferred_currency text NOT NULL DEFAULT 'TND'
        CHECK (preferred_currency IN ('TND','DZD','SAR','EGP','MAD','USD')),
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE farms (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name            text NOT NULL,
    location_text   text,
    latitude        double precision,
    longitude       double precision,
    area_hectares   double precision,
    currency        text NOT NULL DEFAULT 'TND',
    demo_data_seeded boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE farm_members (
    farm_id     uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role        text NOT NULL DEFAULT 'viewer'
        CHECK (role IN ('owner','manager','worker','viewer')),
    PRIMARY KEY (farm_id, user_id)
);

-- ============================================================
-- 2. EXPENSES: categories, expenses
-- ============================================================

CREATE TABLE categories (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name            text NOT NULL,
    icon            text NOT NULL DEFAULT '📦',
    color           text NOT NULL DEFAULT '#64748b',
    budget_planned  double precision,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expenses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    category_id     uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount          double precision NOT NULL CHECK (amount >= 0),
    currency        text NOT NULL DEFAULT 'TND',
    description     text NOT NULL,
    notes           text,
    date            date NOT NULL,
    receipt_url     text,
    created_by      uuid NOT NULL REFERENCES profiles(id),
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_farm_date ON expenses(farm_id, date DESC);
CREATE INDEX idx_expenses_category  ON expenses(category_id);

-- ============================================================
-- 3. CROPS & TASKS
-- ============================================================

CREATE TABLE crops (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id             uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_type           text NOT NULL,
    variety             text,
    field_name          text,
    area_hectares       double precision,
    planting_date       date,
    expected_harvest    date,
    actual_harvest      date,
    yield_kg            double precision,
    status              text NOT NULL DEFAULT 'planned'
        CHECK (status IN ('planned','planted','growing','harvested')),
    current_stage       text,
    latitude            double precision,
    longitude           double precision,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_crops_farm ON crops(farm_id);

CREATE TABLE tasks (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    crop_id         uuid REFERENCES crops(id) ON DELETE SET NULL,
    title           text NOT NULL,
    description     text,
    assigned_to     text,
    due_date        date,
    completed_at    timestamptz,
    priority        text NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low','medium','high','urgent')),
    status          text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','in_progress','done')),
    recurring       boolean NOT NULL DEFAULT false,
    recurrence_rule text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_farm   ON tasks(farm_id);
CREATE INDEX idx_tasks_crop   ON tasks(crop_id);
CREATE INDEX idx_tasks_status ON tasks(farm_id, status);

-- ============================================================
-- 4. LIVESTOCK
-- ============================================================

CREATE TABLE animals (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id             uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                text NOT NULL,
    type                text NOT NULL
        CHECK (type IN ('sheep','cattle','poultry','goat')),
    breed               text NOT NULL,
    gender              text NOT NULL CHECK (gender IN ('male','female')),
    birth_date          date,
    weight_kg           double precision,
    tag_number          text NOT NULL,
    status              text NOT NULL DEFAULT 'healthy'
        CHECK (status IN ('healthy','sick','pregnant','sold','deceased')),
    mother_id           uuid REFERENCES animals(id) ON DELETE SET NULL,
    acquisition_date    date NOT NULL,
    acquisition_type    text NOT NULL
        CHECK (acquisition_type IN ('born','purchased')),
    purchase_price      double precision,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_animals_farm   ON animals(farm_id);
CREATE INDEX idx_animals_type   ON animals(farm_id, type);
CREATE INDEX idx_animals_status ON animals(farm_id, status);

CREATE TABLE vaccination_records (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id       uuid NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    vaccine_name    text NOT NULL,
    date            date NOT NULL,
    next_due        date,
    administered_by text,
    cost            double precision,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vaccinations_animal ON vaccination_records(animal_id);

CREATE TABLE feed_records (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id         uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    feed_type       text NOT NULL,
    quantity_kg     double precision NOT NULL CHECK (quantity_kg > 0),
    cost_per_kg     double precision NOT NULL CHECK (cost_per_kg >= 0),
    purchase_date   date NOT NULL,
    remaining_kg    double precision NOT NULL DEFAULT 0,
    notes           text,
    created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_farm ON feed_records(farm_id);

-- ============================================================
-- 5. INVENTORY
-- ============================================================

CREATE TABLE inventory_items (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id             uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                text NOT NULL,
    category            text NOT NULL
        CHECK (category IN ('equipment','chemicals','seeds','tools','supplies','spare_parts')),
    quantity            double precision NOT NULL DEFAULT 0,
    unit                text NOT NULL,
    min_stock           double precision NOT NULL DEFAULT 0,
    location            text NOT NULL,
    purchase_date       date NOT NULL,
    purchase_price      double precision NOT NULL DEFAULT 0,
    condition           text NOT NULL DEFAULT 'new'
        CHECK (condition IN ('new','good','fair','needs_repair','broken')),
    last_maintenance    date,
    next_maintenance    date,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_inventory_farm     ON inventory_items(farm_id);
CREATE INDEX idx_inventory_category ON inventory_items(farm_id, category);

-- ============================================================
-- 6. WATER
-- ============================================================

CREATE TABLE wells (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id             uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                text NOT NULL,
    depth_meters        double precision NOT NULL,
    water_level_meters  double precision,
    water_quality       text NOT NULL DEFAULT 'fresh'
        CHECK (water_quality IN ('fresh','brackish','saline')),
    status              text NOT NULL DEFAULT 'drilling'
        CHECK (status IN ('drilling','testing','active','inactive')),
    total_cost          double precision,
    salinity_ppm        double precision,
    latitude            double precision,
    longitude           double precision,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wells_farm ON wells(farm_id);

CREATE TABLE well_layers (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    well_id     uuid NOT NULL REFERENCES wells(id) ON DELETE CASCADE,
    depth_from  double precision NOT NULL,
    depth_to    double precision NOT NULL,
    layer_type  text NOT NULL
        CHECK (layer_type IN ('soil','rock','clay','water','sand','gravel')),
    notes       text
);

CREATE INDEX idx_well_layers ON well_layers(well_id);

CREATE TABLE water_tanks (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id                 uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                    text NOT NULL,
    type                    text NOT NULL
        CHECK (type IN ('ground','elevated','underground')),
    capacity_liters         double precision NOT NULL,
    current_level_percent   double precision NOT NULL DEFAULT 0
        CHECK (current_level_percent >= 0 AND current_level_percent <= 100),
    source                  text NOT NULL,
    status                  text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','maintenance','empty','inactive')),
    last_filled             date,
    notes                   text,
    created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tanks_farm ON water_tanks(farm_id);

CREATE TABLE irrigation_networks (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id             uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                text NOT NULL,
    type                text NOT NULL
        CHECK (type IN ('drip','sprinkler','flood','pivot')),
    coverage_hectares   double precision NOT NULL DEFAULT 0,
    source_id           uuid,
    source_name         text NOT NULL,
    status              text NOT NULL DEFAULT 'planned'
        CHECK (status IN ('active','maintenance','inactive','planned')),
    flow_rate_lph       double precision,
    last_maintenance    date,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_irrigation_farm ON irrigation_networks(farm_id);

-- ============================================================
-- 7. ENERGY
-- ============================================================

CREATE TABLE solar_panels (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id                 uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                    text NOT NULL,
    capacity_kw             double precision NOT NULL DEFAULT 0,
    panel_count             integer NOT NULL DEFAULT 0,
    daily_production_kwh    double precision NOT NULL DEFAULT 0,
    efficiency_percent      double precision NOT NULL DEFAULT 0,
    installation_date       date,
    inverter_type           text,
    status                  text NOT NULL DEFAULT 'inactive'
        CHECK (status IN ('active','maintenance','inactive')),
    total_cost              double precision NOT NULL DEFAULT 0,
    notes                   text,
    created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_solar_farm ON solar_panels(farm_id);

CREATE TABLE electricity_meters (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id                 uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                    text NOT NULL,
    meter_number            text NOT NULL,
    provider                text NOT NULL,
    monthly_consumption_kwh double precision NOT NULL DEFAULT 0,
    monthly_cost            double precision NOT NULL DEFAULT 0,
    currency                text NOT NULL DEFAULT 'TND',
    tariff_type             text NOT NULL DEFAULT 'agricultural'
        CHECK (tariff_type IN ('agricultural','residential','commercial')),
    status                  text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','suspended','disconnected')),
    last_reading_date       date,
    notes                   text,
    created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_electricity_farm ON electricity_meters(farm_id);

CREATE TABLE generators (
    id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id                 uuid NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    name                    text NOT NULL,
    fuel_type               text NOT NULL
        CHECK (fuel_type IN ('diesel','gasoline','gas')),
    capacity_kva            double precision NOT NULL DEFAULT 0,
    runtime_hours           double precision NOT NULL DEFAULT 0,
    fuel_consumption_lph    double precision NOT NULL DEFAULT 0,
    last_maintenance        date,
    next_maintenance_hours  double precision,
    status                  text NOT NULL DEFAULT 'standby'
        CHECK (status IN ('running','standby','maintenance','broken')),
    total_cost              double precision NOT NULL DEFAULT 0,
    notes                   text,
    created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_generators_farm ON generators(farm_id);
