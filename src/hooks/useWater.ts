import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWells, getTanks, getIrrigation, createWell, createTank, createIrrigation } from "@/lib/actions/water";
import { Well, WaterTank, IrrigationNetwork } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useWater(
    initialWells: Well[],
    initialTanks: WaterTank[],
    initialIrrigation: IrrigationNetwork[]
) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Queries
    const wellsQuery = useQuery({
        queryKey: ["wells"],
        queryFn: async () => {
            const res = await getWells();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData: initialWells,
    });

    const tanksQuery = useQuery({
        queryKey: ["tanks"],
        queryFn: async () => {
            const res = await getTanks();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData: initialTanks,
    });

    const irrigationQuery = useQuery({
        queryKey: ["irrigation"],
        queryFn: async () => {
            const res = await getIrrigation();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData: initialIrrigation,
    });

    // Mutations
    const createWellMutation = useMutation({
        mutationFn: async (newWell: Parameters<typeof createWell>[0]) => {
            const res = await createWell(newWell);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newWell) => {
            await queryClient.cancelQueries({ queryKey: ["wells"] });
            const previousWells = queryClient.getQueryData<Well[]>(["wells"]);

            queryClient.setQueryData<Well[]>(["wells"], (old) => {
                const optimisticWell: Well = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newWell.name,
                    depth_meters: newWell.depth_meters,
                    water_level_meters: newWell.water_level_meters,
                    water_quality: (newWell.water_quality as Well["water_quality"]) || "fresh",
                    status: (newWell.status as Well["status"]) || "drilling",
                    total_cost: newWell.total_cost ?? 0,
                    salinity_ppm: newWell.salinity_ppm,
                    latitude: newWell.latitude,
                    longitude: newWell.longitude,
                };
                return old ? [optimisticWell, ...old] : [optimisticWell];
            });

            return { previousWells };
        },
        onError: (err, newWell, context) => {
            queryClient.setQueryData(["wells"], context?.previousWells);
            addToast("error", `فشل في إضافة البئر: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["wells"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة البئر بنجاح");
        }
    });

    const createTankMutation = useMutation({
        mutationFn: async (newTank: Parameters<typeof createTank>[0]) => {
            const res = await createTank(newTank);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newTank) => {
            await queryClient.cancelQueries({ queryKey: ["tanks"] });
            const previousTanks = queryClient.getQueryData<WaterTank[]>(["tanks"]);

            queryClient.setQueryData<WaterTank[]>(["tanks"], (old) => {
                const optimisticTank: WaterTank = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newTank.name,
                    type: newTank.type as WaterTank["type"],
                    capacity_liters: newTank.capacity_liters,
                    current_level_percent: 0,
                    source: newTank.source,
                    status: (newTank.status as WaterTank["status"]) || "active",
                    notes: newTank.notes,
                };
                return old ? [optimisticTank, ...old] : [optimisticTank];
            });

            return { previousTanks };
        },
        onError: (err, newTank, context) => {
            queryClient.setQueryData(["tanks"], context?.previousTanks);
            addToast("error", `فشل في إضافة الخزان: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tanks"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة الخزان بنجاح");
        }
    });

    const createIrrigationMutation = useMutation({
        mutationFn: async (newIrr: Parameters<typeof createIrrigation>[0]) => {
            const res = await createIrrigation(newIrr);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newIrr) => {
            await queryClient.cancelQueries({ queryKey: ["irrigation"] });
            const previousIrr = queryClient.getQueryData<IrrigationNetwork[]>(["irrigation"]);

            queryClient.setQueryData<IrrigationNetwork[]>(["irrigation"], (old) => {
                const optimisticIrr: IrrigationNetwork = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    name: newIrr.name,
                    type: newIrr.type as IrrigationNetwork["type"],
                    coverage_hectares: newIrr.coverage_hectares,
                    source_id: newIrr.source_id,
                    source_name: newIrr.source_name ?? "",
                    status: (newIrr.status as IrrigationNetwork["status"]) || "planned",
                    flow_rate_lph: newIrr.flow_rate_lph,
                    notes: newIrr.notes,
                };
                return old ? [optimisticIrr, ...old] : [optimisticIrr];
            });

            return { previousIrr };
        },
        onError: (err, newIrr, context) => {
            queryClient.setQueryData(["irrigation"], context?.previousIrr);
            addToast("error", `فشل في إضافة شبكة الري: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["irrigation"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة شبكة الري بنجاح");
        }
    });

    return {
        wells: wellsQuery.data || [],
        tanks: tanksQuery.data || [],
        irrigation: irrigationQuery.data || [],
        isLoading: wellsQuery.isLoading || tanksQuery.isLoading || irrigationQuery.isLoading,
        createWell: createWellMutation.mutate,
        isCreatingWell: createWellMutation.isPending,
        createTank: createTankMutation.mutate,
        isCreatingTank: createTankMutation.isPending,
        createIrrigation: createIrrigationMutation.mutate,
        isCreatingIrrigation: createIrrigationMutation.isPending,
    };
}
