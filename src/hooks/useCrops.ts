import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCrops, createCrop, updateCrop } from "@/lib/actions/crops";
import { Crop } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useCrops(initialData: Crop[]) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Query
    const query = useQuery({
        queryKey: ["crops"],
        queryFn: getCrops,
        initialData,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: createCrop,
        onMutate: async (newCrop) => {
            await queryClient.cancelQueries({ queryKey: ["crops"] });
            const previousCrops = queryClient.getQueryData<Crop[]>(["crops"]);

            queryClient.setQueryData<Crop[]>(["crops"], (old) => {
                const optimisticCrop = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "planned", // Default if not provided
                    ...newCrop,
                } as Crop;

                return old ? [optimisticCrop, ...old] : [optimisticCrop];
            });

            return { previousCrops };
        },
        onError: (err, newCrop, context) => {
            queryClient.setQueryData(["crops"], context?.previousCrops);
            addToast("error", `فشل في إضافـة المحصول: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["crops"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة المحصول بنجاح");
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Crop> }) => updateCrop(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["crops"] });
            const previousCrops = queryClient.getQueryData<Crop[]>(["crops"]);

            queryClient.setQueryData<Crop[]>(["crops"], (old) => {
                if (!old) return old;
                return old.map(crop => {
                    if (crop.id === id) {
                        return { ...crop, ...updates } as Crop;
                    }
                    return crop;
                });
            });
            return { previousCrops };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["crops"], context?.previousCrops);
            addToast("error", `فشل في تحديث المحصول: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["crops"] });
        },
        onSuccess: () => {
            addToast("success", "تم تحديث المحصول بنجاح");
        }
    });

    return {
        crops: query.data || [],
        isLoading: query.isLoading,
        createCrop: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateCrop: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    };
}
