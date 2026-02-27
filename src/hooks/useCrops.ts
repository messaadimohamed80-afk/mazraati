import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCrops, createCrop, updateCrop } from "@/lib/actions/crops";
import { Crop } from "@/lib/types";
import { useToast } from "@/components/Toast";

/** Build an optimistic Crop with required defaults */
function buildOptimisticCrop(input: Parameters<typeof createCrop>[0]): Crop {
    return {
        id: `temp-${Date.now()}`,
        farm_id: "temp",
        created_at: new Date().toISOString(),
        crop_type: input.crop_type,
        variety: input.variety,
        field_name: input.field_name,
        area_hectares: input.area_hectares,
        planting_date: input.planting_date,
        expected_harvest: input.expected_harvest,
        status: (input.status as Crop["status"]) || "planned",
        latitude: input.latitude,
        longitude: input.longitude,
        notes: input.notes,
    };
}

export function useCrops(initialData: Crop[]) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Query
    const query = useQuery({
        queryKey: ["crops"],
        queryFn: async () => {
            const res = await getCrops();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (newCrop: Parameters<typeof createCrop>[0]) => {
            const res = await createCrop(newCrop);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newCrop) => {
            await queryClient.cancelQueries({ queryKey: ["crops"] });
            const previousCrops = queryClient.getQueryData<Crop[]>(["crops"]);

            queryClient.setQueryData<Crop[]>(["crops"], (old) => {
                const optimistic = buildOptimisticCrop(newCrop);
                return old ? [optimistic, ...old] : [optimistic];
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
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<Crop> }) => {
            const res = await updateCrop(id, updates);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["crops"] });
            const previousCrops = queryClient.getQueryData<Crop[]>(["crops"]);

            queryClient.setQueryData<Crop[]>(["crops"], (old) => {
                if (!old) return old;
                return old.map(crop => crop.id === id ? { ...crop, ...updates } : crop);
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
