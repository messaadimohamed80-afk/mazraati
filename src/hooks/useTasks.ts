import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/actions/crops";
import { Task } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useTasks(initialData: Task[]) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Query
    // Query
    const query = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await getTasks();
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        initialData,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (newTask: Parameters<typeof createTask>[0]) => {
            const res = await createTask(newTask);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(["tasks"], (old) => {
                const optimisticTask = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "pending",
                    recurring: false,
                    ...newTask,
                } as Task;

                return old ? [optimisticTask, ...old] : [optimisticTask];
            });

            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            queryClient.setQueryData(["tasks"], context?.previousTasks);
            addToast("error", `فشل في إضـافة المهمة: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة المهمة بنجاح");
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<Task> }) => {
            const res = await updateTask(id, updates);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(["tasks"], (old) => {
                if (!old) return old;
                return old.map(t => {
                    if (t.id === id) {
                        return { ...t, ...updates } as Task;
                    }
                    return t;
                });
            });
            return { previousTasks };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["tasks"], context?.previousTasks);
            addToast("error", `فشل في تحديث المهمة: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onSuccess: () => {
            addToast("success", "تم تحديث المهمة بنجاح");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteTask(id);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

            queryClient.setQueryData<Task[]>(["tasks"], (old) => {
                return old ? old.filter(t => t.id !== id) : old;
            });
            return { previousTasks };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["tasks"], context?.previousTasks);
            addToast("error", `فشل في حذف المهمة: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onSuccess: () => {
            addToast("success", "تم حذف المهمة بنجاح");
        }
    });

    return {
        tasks: query.data || [],
        isLoading: query.isLoading,
        createTask: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateTask: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteTask: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
