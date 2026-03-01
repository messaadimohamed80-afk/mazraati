import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "@/lib/actions/expenses";
import { unwrap } from "@/lib/action-result";
import { Expense, Category } from "@/lib/types";
import { useToast } from "@/components/Toast";

export function useExpenses(initialData: Expense[], categories: Category[]) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Query
    const query = useQuery({
        queryKey: ["expenses"],
        queryFn: () => unwrap(getExpenses),
        initialData,
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (newExpense: Parameters<typeof createExpense>[0]) => {
            const res = await createExpense(newExpense);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (newExpense) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });
            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"]);

            queryClient.setQueryData<Expense[]>(["expenses"], (old) => {
                const category = categories.find((c) => c.id === newExpense.category_id);
                const optimisticExpense: Expense = {
                    id: crypto.randomUUID(),
                    farm_id: "temp",
                    currency: "TND",
                    created_by: "temp",
                    created_at: new Date().toISOString(),
                    description: newExpense.description,
                    amount: newExpense.amount,
                    date: newExpense.date,
                    category_id: newExpense.category_id,
                    category,
                    notes: newExpense.notes,
                };

                return old ? [optimisticExpense, ...old] : [optimisticExpense];
            });

            return { previousExpenses };
        },
        onError: (err, newExpense, context) => {
            queryClient.setQueryData(["expenses"], context?.previousExpenses);
            addToast("error", `فشل في إضافة المصروف: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة المصروف بنجاح");
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updates }: { id: string, updates: Partial<Expense> }) => {
            const res = await updateExpense(id, updates);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });
            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"]);

            queryClient.setQueryData<Expense[]>(["expenses"], (old) => {
                if (!old) return old;
                return old.map(exp => {
                    if (exp.id === id) {
                        const newCatId = updates.category_id || exp.category_id;
                        const category = categories.find((c) => c.id === newCatId) || exp.category;
                        return { ...exp, ...updates, category };
                    }
                    return exp;
                });
            });
            return { previousExpenses };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["expenses"], context?.previousExpenses);
            addToast("error", `فشل في تحديث المصروف: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onSuccess: () => {
            addToast("success", "تم تحديث المصروف بنجاح");
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await deleteExpense(id);
            if (!res.ok) throw new Error(res.error.message);
            return res.data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });
            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"]);

            queryClient.setQueryData<Expense[]>(["expenses"], (old) => {
                return old ? old.filter(e => e.id !== id) : old;
            });
            return { previousExpenses };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["expenses"], context?.previousExpenses);
            addToast("error", `فشل في حذف المصروف: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
        },
        onSuccess: () => {
            addToast("success", "تم حذف المصروف بنجاح");
        }
    });

    return {
        expenses: query.data || [],
        isLoading: query.isLoading,
        createExpense: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateExpense: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        deleteExpense: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
