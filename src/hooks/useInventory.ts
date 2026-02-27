import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/actions/inventory";
import { InventoryItem } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useInventory(initialData: InventoryItem[]) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Query
    const query = useQuery({
        queryKey: ["inventory"],
        queryFn: async () => {
            const res = await getInventory();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (newItem: Parameters<typeof createInventoryItem>[0]) => {
            const res = await createInventoryItem(newItem);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: ["inventory"] });
            const previousItems = queryClient.getQueryData<InventoryItem[]>(["inventory"]);

            queryClient.setQueryData<InventoryItem[]>(["inventory"], (old) => {
                const optimisticItem = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    condition: "new",
                    ...newItem,
                } as InventoryItem;

                return old ? [optimisticItem, ...old] : [optimisticItem];
            });

            return { previousItems };
        },
        onError: (err, newItem, context) => {
            queryClient.setQueryData(["inventory"], context?.previousItems);
            addToast("error", `فشل في إضافة العنصر: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة العنصر بنجاح");
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<InventoryItem> }) => {
            const res = await updateInventoryItem(id, updates);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["inventory"] });
            const previousItems = queryClient.getQueryData<InventoryItem[]>(["inventory"]);

            queryClient.setQueryData<InventoryItem[]>(["inventory"], (old) => {
                if (!old) return old;
                return old.map(item => {
                    if (item.id === id) {
                        return { ...item, ...updates } as InventoryItem;
                    }
                    return item;
                });
            });
            return { previousItems };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["inventory"], context?.previousItems);
            addToast("error", `فشل في تحديث العنصر: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
        onSuccess: () => {
            addToast("success", "تم تحديث العنصر بنجاح");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteInventoryItem(id);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["inventory"] });
            const previousItems = queryClient.getQueryData<InventoryItem[]>(["inventory"]);

            queryClient.setQueryData<InventoryItem[]>(["inventory"], (old) => {
                return old ? old.filter(i => i.id !== id) : old;
            });
            return { previousItems };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["inventory"], context?.previousItems);
            addToast("error", `فشل في حذف العنصر: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] });
        },
        onSuccess: () => {
            addToast("success", "تم حذف العنصر بنجاح");
        }
    });

    return {
        inventory: query.data || [],
        isLoading: query.isLoading,
        createItem: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateItem: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteItem: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
