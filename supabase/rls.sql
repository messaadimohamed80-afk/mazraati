-- ============================================================
-- مزرعتي (Mazraati) — Row Level Security Policies (FIXED)
-- Run AFTER schema.sql
-- FIX: Uses public.user_farm_ids() instead of auth.user_farm_ids()
-- ============================================================

-- ============================================================
-- Helper: Function to check farm membership
-- ============================================================

CREATE OR REPLACE FUNCTION public.user_farm_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT farm_id FROM farm_members WHERE user_id = auth.uid()
$$;

-- ============================================================
-- PROFILES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (id = auth.uid());

-- ============================================================
-- FARMS
-- ============================================================

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farm members can view their farms"
    ON farms FOR SELECT
    USING (id IN (SELECT public.user_farm_ids()));

CREATE POLICY "Farm owners can update their farms"
    ON farms FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Any authenticated user can create a farm"
    ON farms FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Farm owners can delete their farms"
    ON farms FOR DELETE
    USING (owner_id = auth.uid());

-- ============================================================
-- FARM MEMBERS
-- ============================================================

ALTER TABLE farm_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farm members can view co-members"
    ON farm_members FOR SELECT
    USING (farm_id IN (SELECT public.user_farm_ids()));

CREATE POLICY "Farm owners can manage members"
    ON farm_members FOR ALL
    USING (farm_id IN (
        SELECT id FROM farms WHERE owner_id = auth.uid()
    ));

-- ============================================================
-- FARM-SCOPED TABLES
-- ============================================================

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON categories FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON expenses FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Crops
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON crops FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON tasks FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Animals
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON animals FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Vaccination Records (via animal → farm join)
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON vaccination_records FOR ALL
    USING (animal_id IN (
        SELECT id FROM animals WHERE farm_id IN (SELECT public.user_farm_ids())
    ))
    WITH CHECK (animal_id IN (
        SELECT id FROM animals WHERE farm_id IN (SELECT public.user_farm_ids())
    ));

-- Feed Records
ALTER TABLE feed_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON feed_records FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Inventory Items
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON inventory_items FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Wells
ALTER TABLE wells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON wells FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Well Layers (via well → farm join)
ALTER TABLE well_layers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON well_layers FOR ALL
    USING (well_id IN (
        SELECT id FROM wells WHERE farm_id IN (SELECT public.user_farm_ids())
    ))
    WITH CHECK (well_id IN (
        SELECT id FROM wells WHERE farm_id IN (SELECT public.user_farm_ids())
    ));

-- Water Tanks
ALTER TABLE water_tanks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON water_tanks FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Irrigation Networks
ALTER TABLE irrigation_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON irrigation_networks FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Solar Panels
ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON solar_panels FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Electricity Meters
ALTER TABLE electricity_meters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON electricity_meters FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- Generators
ALTER TABLE generators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "farm_access" ON generators FOR ALL
    USING (farm_id IN (SELECT public.user_farm_ids()))
    WITH CHECK (farm_id IN (SELECT public.user_farm_ids()));

-- ============================================================
-- TRIGGER: Auto-create profile + farm_member on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, full_name, preferred_currency)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
        'TND'
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
