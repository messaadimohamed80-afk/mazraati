import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getSolarPanels, createSolarPanel,
    getElectricityMeters, createElectricityMeter,
    getGenerators, createGenerator
} from "@/lib/actions/energy";
import { unwrap } from "@/lib/action-result";
import { SolarPanel, ElectricityMeter, Generator } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useEnergy(
    initialSolar: SolarPanel[],
    initialMeters: ElectricityMeter[],
    initialGenerators: Generator[]
) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Queries
    const solarQuery = useQuery({
        queryKey: ["solar"],
        queryFn: () => unwrap(getSolarPanels),
        initialData: initialSolar,
    });

    const metersQuery = useQuery({
        queryKey: ["meters"],
        queryFn: () => unwrap(getElectricityMeters),
        initialData: initialMeters,
    });

    const generatorsQuery = useQuery({
        queryKey: ["generators"],
        queryFn: () => unwrap(getGenerators),
        initialData: initialGenerators,
    });

    // Mutations
    const createSolarMutation = useMutation({
        mutationFn: async (newPanel: Parameters<typeof createSolarPanel>[0]) => {
            const res = await createSolarPanel(newPanel);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newPanel) => {
            await queryClient.cancelQueries({ queryKey: ["solar"] });
            const previousSolar = queryClient.getQueryData<SolarPanel[]>(["solar"]);

            queryClient.setQueryData<SolarPanel[]>(["solar"], (old) => {
                const optimisticPanel: SolarPanel = {
                    id: crypto.randomUUID(),
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newPanel.name,
                    capacity_kw: newPanel.capacity_kw,
                    panel_count: newPanel.panel_count,
                    daily_production_kwh: newPanel.daily_production_kwh ?? 0,
                    efficiency_percent: newPanel.efficiency_percent ?? 0,
                    installation_date: newPanel.installation_date ?? "",
                    inverter_type: newPanel.inverter_type ?? "",
                    status: (newPanel.status as SolarPanel["status"]) || "active",
                    total_cost: newPanel.total_cost ?? 0,
                    notes: newPanel.notes,
                };
                return old ? [optimisticPanel, ...old] : [optimisticPanel];
            });

            return { previousSolar };
        },
        onError: (err, newPanel, context) => {
            queryClient.setQueryData(["solar"], context?.previousSolar);
            addToast("error", `فشل في إضافة اللوح الشمسي: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["solar"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة اللوح الشمسي بنجاح");
        }
    });

    const createMeterMutation = useMutation({
        mutationFn: async (newMeter: Parameters<typeof createElectricityMeter>[0]) => {
            const res = await createElectricityMeter(newMeter);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newMeter) => {
            await queryClient.cancelQueries({ queryKey: ["meters"] });
            const previousMeters = queryClient.getQueryData<ElectricityMeter[]>(["meters"]);

            queryClient.setQueryData<ElectricityMeter[]>(["meters"], (old) => {
                const optimisticMeter: ElectricityMeter = {
                    id: crypto.randomUUID(),
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newMeter.name,
                    meter_number: newMeter.meter_number,
                    provider: newMeter.provider ?? "",
                    monthly_consumption_kwh: newMeter.monthly_consumption_kwh ?? 0,
                    monthly_cost: newMeter.monthly_cost ?? 0,
                    currency: newMeter.currency ?? "TND",
                    tariff_type: (newMeter.tariff_type as ElectricityMeter["tariff_type"]) || "agricultural",
                    status: (newMeter.status as ElectricityMeter["status"]) || "active",
                    last_reading_date: "",
                    notes: newMeter.notes,
                };
                return old ? [optimisticMeter, ...old] : [optimisticMeter];
            });

            return { previousMeters };
        },
        onError: (err, newMeter, context) => {
            queryClient.setQueryData(["meters"], context?.previousMeters);
            addToast("error", `فشل في إضافة العداد: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["meters"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة العداد بنجاح");
        }
    });

    const createGeneratorMutation = useMutation({
        mutationFn: async (newGen: Parameters<typeof createGenerator>[0]) => {
            const res = await createGenerator(newGen);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newGen) => {
            await queryClient.cancelQueries({ queryKey: ["generators"] });
            const previousGenerators = queryClient.getQueryData<Generator[]>(["generators"]);

            queryClient.setQueryData<Generator[]>(["generators"], (old) => {
                const optimisticGen: Generator = {
                    id: crypto.randomUUID(),
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newGen.name,
                    capacity_kva: newGen.capacity_kva ?? 0,
                    fuel_type: newGen.fuel_type as Generator["fuel_type"],
                    fuel_consumption_lph: newGen.fuel_consumption_lph ?? 0,
                    runtime_hours: newGen.runtime_hours ?? 0,
                    last_maintenance: newGen.last_maintenance ?? "",
                    next_maintenance_hours: newGen.next_maintenance_hours ?? 0,
                    status: (newGen.status as Generator["status"]) || "standby",
                    total_cost: newGen.total_cost ?? 0,
                    notes: newGen.notes,
                };
                return old ? [optimisticGen, ...old] : [optimisticGen];
            });

            return { previousGenerators };
        },
        onError: (err, newGen, context) => {
            queryClient.setQueryData(["generators"], context?.previousGenerators);
            addToast("error", `فشل في إضافة المولد: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["generators"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة المولد بنجاح");
        }
    });

    return {
        solarPanels: solarQuery.data || [],
        meters: metersQuery.data || [],
        generators: generatorsQuery.data || [],
        isLoading: solarQuery.isLoading || metersQuery.isLoading || generatorsQuery.isLoading,
        createSolarPanel: createSolarMutation.mutate,
        isCreatingSolar: createSolarMutation.isPending,
        createMeter: createMeterMutation.mutate,
        isCreatingMeter: createMeterMutation.isPending,
        createGenerator: createGeneratorMutation.mutate,
        isCreatingGenerator: createGeneratorMutation.isPending,
    };
}
