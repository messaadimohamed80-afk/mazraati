"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Seed demo data for a new farm.
 * Uses the service-role client to bypass RLS.
 * Called automatically for the first 3 registered users.
 */
export async function seedDemoData(farmId: string, userId: string): Promise<void> {
    const supabase = createServiceRoleClient();

    try {
        const { MOCK_CATEGORIES, MOCK_EXPENSES } = await import("@/lib/mock/mock-data");
        const { MOCK_CROPS, MOCK_TASKS } = await import("@/lib/mock/mock-crops-tasks-data");
        const { MOCK_ANIMALS, MOCK_FEED } = await import("@/lib/mock/mock-livestock-data");
        const { MOCK_INVENTORY } = await import("@/lib/mock/mock-inventory-data");
        const { MOCK_WELLS, MOCK_WELL_LAYERS, MOCK_TANKS, MOCK_IRRIGATION } = await import("@/lib/mock/mock-water-data");
        const { MOCK_SOLAR, MOCK_ELECTRICITY, MOCK_GENERATORS } = await import("@/lib/mock/mock-energy-data");

        // ── 1. Categories ──────────────────────────────────
        const catInserts = MOCK_CATEGORIES.map((c) => ({
            farm_id: farmId,
            name: c.name,
            icon: c.icon,
            color: c.color,
            budget_planned: c.budget_planned,
        }));
        const { data: insertedCats } = await supabase
            .from("categories")
            .insert(catInserts)
            .select("id, name");

        // Build old-name → new-id map so expenses can reference the right category
        const catMap = new Map<string, string>();
        (insertedCats ?? []).forEach((c) => catMap.set(c.name, c.id));

        // ── 2. Expenses ────────────────────────────────────
        const expInserts = MOCK_EXPENSES.map((e) => {
            const origCat = MOCK_CATEGORIES.find((c) => c.id === e.category_id);
            const newCatId = origCat ? catMap.get(origCat.name) : null;
            return {
                farm_id: farmId,
                category_id: newCatId ?? (insertedCats?.[0]?.id ?? farmId),
                amount: e.amount,
                currency: e.currency || "TND",
                description: e.description,
                notes: e.notes || null,
                date: e.date,
                created_by: userId,
            };
        });
        await supabase.from("expenses").insert(expInserts);

        // ── 3. Crops ───────────────────────────────────────
        const cropInserts = MOCK_CROPS.map((c) => ({
            farm_id: farmId,
            crop_type: c.crop_type,
            variety: c.variety || null,
            field_name: c.field_name || null,
            area_hectares: c.area_hectares || null,
            planting_date: c.planting_date || null,
            expected_harvest: c.expected_harvest || null,
            actual_harvest: c.actual_harvest || null,
            yield_kg: c.yield_kg || null,
            status: c.status,
            current_stage: c.current_stage || null,
            latitude: c.latitude || null,
            longitude: c.longitude || null,
            notes: c.notes || null,
        }));
        await supabase.from("crops").insert(cropInserts);

        // ── 4. Tasks ───────────────────────────────────────
        const taskInserts = MOCK_TASKS.map((t) => ({
            farm_id: farmId,
            title: t.title,
            description: t.description || null,
            assigned_to: t.assigned_to || null,
            due_date: t.due_date || null,
            priority: t.priority,
            status: t.status,
            recurring: t.recurring ?? false,
        }));
        await supabase.from("tasks").insert(taskInserts);

        // ── 5. Animals ─────────────────────────────────────
        const animalInserts = MOCK_ANIMALS.map((a) => ({
            farm_id: farmId,
            name: a.name,
            type: a.type,
            breed: a.breed,
            gender: a.gender,
            birth_date: a.birth_date || null,
            weight_kg: a.weight_kg || null,
            tag_number: a.tag_number,
            status: a.status,
            acquisition_date: a.acquisition_date,
            acquisition_type: a.acquisition_type,
            purchase_price: a.purchase_price || null,
            notes: a.notes || null,
        }));
        await supabase.from("animals").insert(animalInserts);

        // ── 6. Feed Records ────────────────────────────────
        const feedInserts = MOCK_FEED.map((f) => ({
            farm_id: farmId,
            feed_type: f.feed_type,
            quantity_kg: f.quantity_kg,
            cost_per_kg: f.cost_per_kg,
            purchase_date: f.purchase_date,
            remaining_kg: f.remaining_kg,
        }));
        await supabase.from("feed_records").insert(feedInserts);

        // ── 7. Inventory ───────────────────────────────────
        const invInserts = MOCK_INVENTORY.map((i) => ({
            farm_id: farmId,
            name: i.name,
            category: i.category,
            quantity: i.quantity,
            unit: i.unit || "piece",
            min_stock: i.min_stock ?? 0,
            purchase_price: i.purchase_price,
            purchase_date: i.purchase_date || new Date().toISOString().split("T")[0],
            condition: i.condition,
            location: i.location || "المستودع",
            notes: i.notes || null,
        }));
        await supabase.from("inventory_items").insert(invInserts);

        // ── 8. Wells ───────────────────────────────────────
        const wellInserts = MOCK_WELLS.map((w) => ({
            farm_id: farmId,
            name: w.name,
            depth_meters: w.depth_meters,
            water_level_meters: w.water_level_meters || null,
            water_quality: w.water_quality || "fresh",
            status: w.status,
            total_cost: w.total_cost || null,
            salinity_ppm: w.salinity_ppm || null,
            latitude: w.latitude || null,
            longitude: w.longitude || null,
        }));
        const { data: insertedWells } = await supabase
            .from("wells")
            .insert(wellInserts)
            .select("id, name");

        // ── 9. Well Layers ─────────────────────────────────
        if (insertedWells && insertedWells.length > 0) {
            const wellNameToId = new Map<string, string>();
            insertedWells.forEach((w) => wellNameToId.set(w.name, w.id));

            const layerInserts = MOCK_WELL_LAYERS.map((l) => {
                // Find the corresponding well by matching original well_id to mock wells
                const origWell = MOCK_WELLS.find((w) => w.id === l.well_id);
                const newWellId = origWell ? wellNameToId.get(origWell.name) : null;
                return {
                    well_id: newWellId ?? insertedWells[0].id,
                    depth_from: l.depth_from,
                    depth_to: l.depth_to,
                    layer_type: l.layer_type,
                    notes: l.notes || null,
                };
            });
            await supabase.from("well_layers").insert(layerInserts);
        }

        // ── 10. Water Tanks ──────────────────────────────
        const tankInserts = MOCK_TANKS.map((t) => ({
            farm_id: farmId,
            name: t.name,
            type: t.type,
            capacity_liters: t.capacity_liters,
            current_level_percent: t.current_level_percent,
            source: t.source,
            status: t.status || "active",
            notes: t.notes || null,
        }));
        await supabase.from("water_tanks").insert(tankInserts);

        // ── 11. Irrigation Networks ────────────────────────
        const irrInserts = MOCK_IRRIGATION.map((i) => ({
            farm_id: farmId,
            name: i.name,
            type: i.type,
            coverage_hectares: i.coverage_hectares || 0,
            source_name: i.source_name,
            status: i.status,
            flow_rate_lph: i.flow_rate_lph || null,
            notes: i.notes || null,
        }));
        await supabase.from("irrigation_networks").insert(irrInserts);

        // ── 12. Solar Panels ───────────────────────────────
        const solarInserts = MOCK_SOLAR.map((s) => ({
            farm_id: farmId,
            name: s.name,
            capacity_kw: s.capacity_kw,
            panel_count: s.panel_count || 0,
            daily_production_kwh: s.daily_production_kwh || 0,
            efficiency_percent: s.efficiency_percent || 0,
            installation_date: s.installation_date || null,
            inverter_type: s.inverter_type || null,
            status: s.status,
            total_cost: s.total_cost || 0,
            notes: s.notes || null,
        }));
        await supabase.from("solar_panels").insert(solarInserts);

        // ── 13. Electricity Meters ─────────────────────────
        const elecInserts = MOCK_ELECTRICITY.map((e) => ({
            farm_id: farmId,
            name: e.name,
            meter_number: e.meter_number,
            provider: e.provider,
            monthly_consumption_kwh: e.monthly_consumption_kwh || 0,
            monthly_cost: e.monthly_cost || 0,
            currency: e.currency || "TND",
            tariff_type: e.tariff_type || "agricultural",
            status: e.status || "active",
            notes: e.notes || null,
        }));
        await supabase.from("electricity_meters").insert(elecInserts);

        // ── 14. Generators ─────────────────────────────────
        const genInserts = MOCK_GENERATORS.map((g) => ({
            farm_id: farmId,
            name: g.name,
            fuel_type: g.fuel_type,
            capacity_kva: g.capacity_kva,
            runtime_hours: g.runtime_hours || 0,
            fuel_consumption_lph: g.fuel_consumption_lph || 0,
            status: g.status,
            last_maintenance: g.last_maintenance || null,
            total_cost: g.total_cost || 0,
            notes: g.notes || null,
        }));
        await supabase.from("generators").insert(genInserts);

        // ── Mark farm as seeded ────────────────────────────
        await supabase
            .from("farms")
            .update({ demo_data_seeded: true })
            .eq("id", farmId);

        console.log(`✅ Demo data seeded for farm ${farmId}`);
    } catch (err) {
        console.error("⚠️ Demo data seeding failed:", err);
        // Don't throw — seeding failure shouldn't block registration
    }
}
