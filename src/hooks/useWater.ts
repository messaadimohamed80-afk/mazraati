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
        queryFn: getWells,
        initialData: initialWells,
    });

    const tanksQuery = useQuery({
        queryKey: ["tanks"],
        queryFn: getTanks,
        initialData: initialTanks,
    });

    const irrigationQuery = useQuery({
        queryKey: ["irrigation"],
        queryFn: getIrrigation,
        initialData: initialIrrigation,
    });

    // Mutations
    const createWellMutation = useMutation({
        mutationFn: createWell,
        onMutate: async (newWell) => {
            await queryClient.cancelQueries({ queryKey: ["wells"] });
            const previousWells = queryClient.getQueryData<Well[]>(["wells"]);

            queryClient.setQueryData<Well[]>(["wells"], (old) => {
                const optimisticWell = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    water_quality: "fresh",
                    status: "drilling",
                    ...newWell,
                } as Well;
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
        mutationFn: createTank,
        onMutate: async (newTank) => {
            await queryClient.cancelQueries({ queryKey: ["tanks"] });
            const previousTanks = queryClient.getQueryData<WaterTank[]>(["tanks"]);

            queryClient.setQueryData<WaterTank[]>(["tanks"], (old) => {
                const optimisticTank = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    current_level_percent: 0,
                    status: "active",
                    ...newTank,
                } as WaterTank;
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
        mutationFn: createIrrigation,
        onMutate: async (newIrr) => {
            await queryClient.cancelQueries({ queryKey: ["irrigation"] });
            const previousIrr = queryClient.getQueryData<IrrigationNetwork[]>(["irrigation"]);

            queryClient.setQueryData<IrrigationNetwork[]>(["irrigation"], (old) => {
                const optimisticIrr = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "planned",
                    ...newIrr,
                } as IrrigationNetwork;
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
