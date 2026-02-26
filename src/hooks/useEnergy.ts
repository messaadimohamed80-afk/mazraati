import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getSolarPanels, createSolarPanel,
    getElectricityMeters, createElectricityMeter,
    getGenerators, createGenerator
} from "@/lib/actions/energy";
import { SolarPanel, ElectricityMeter, Generator } from "@/lib/mock-energy-data";
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
        queryFn: getSolarPanels,
        initialData: initialSolar,
    });

    const metersQuery = useQuery({
        queryKey: ["meters"],
        queryFn: getElectricityMeters,
        initialData: initialMeters,
    });

    const generatorsQuery = useQuery({
        queryKey: ["generators"],
        queryFn: getGenerators,
        initialData: initialGenerators,
    });

    // Mutations
    const createSolarMutation = useMutation({
        mutationFn: createSolarPanel,
        onMutate: async (newPanel) => {
            await queryClient.cancelQueries({ queryKey: ["solar"] });
            const previousSolar = queryClient.getQueryData<SolarPanel[]>(["solar"]);

            queryClient.setQueryData<SolarPanel[]>(["solar"], (old) => {
                const optimisticPanel = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "active",
                    ...newPanel,
                } as SolarPanel;
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
        mutationFn: createElectricityMeter,
        onMutate: async (newMeter) => {
            await queryClient.cancelQueries({ queryKey: ["meters"] });
            const previousMeters = queryClient.getQueryData<ElectricityMeter[]>(["meters"]);

            queryClient.setQueryData<ElectricityMeter[]>(["meters"], (old) => {
                const optimisticMeter = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "active",
                    ...newMeter,
                } as ElectricityMeter;
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
        mutationFn: createGenerator,
        onMutate: async (newGen) => {
            await queryClient.cancelQueries({ queryKey: ["generators"] });
            const previousGenerators = queryClient.getQueryData<Generator[]>(["generators"]);

            queryClient.setQueryData<Generator[]>(["generators"], (old) => {
                const optimisticGen = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "standby",
                    ...newGen,
                } as Generator;
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
