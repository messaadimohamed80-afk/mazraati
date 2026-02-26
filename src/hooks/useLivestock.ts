import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAnimals,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getVaccinations,
    createVaccination,
    getFeedRecords,
    createFeedRecord
} from "@/lib/actions/livestock";
import { Animal, VaccinationRecord, FeedRecord } from "@/lib/mock-livestock-data";
import { useToast } from "@/components/Toast";

export function useLivestock(
    initialAnimals: Animal[],
    initialVaccinations: VaccinationRecord[],
    initialFeedRecords: FeedRecord[]
) {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    // Queries
    const animalsQuery = useQuery({
        queryKey: ["animals"],
        queryFn: getAnimals,
        initialData: initialAnimals,
    });

    const vaccinationsQuery = useQuery({
        queryKey: ["vaccinations"],
        queryFn: () => getVaccinations(),
        initialData: initialVaccinations,
    });

    const feedQuery = useQuery({
        queryKey: ["feed"],
        queryFn: getFeedRecords,
        initialData: initialFeedRecords,
    });

    // Mutations - Animals
    const createAnimalMutation = useMutation({
        mutationFn: createAnimal,
        onMutate: async (newAnimal) => {
            await queryClient.cancelQueries({ queryKey: ["animals"] });
            const previousAnimals = queryClient.getQueryData<Animal[]>(["animals"]);

            queryClient.setQueryData<Animal[]>(["animals"], (old) => {
                const optimisticAnimal = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    status: "healthy",
                    ...newAnimal,
                } as Animal;
                return old ? [optimisticAnimal, ...old] : [optimisticAnimal];
            });

            return { previousAnimals };
        },
        onError: (err, newAnimal, context) => {
            queryClient.setQueryData(["animals"], context?.previousAnimals);
            addToast("error", `فشل في إضافة الحيوان: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة الحيوان بنجاح");
        }
    });

    const updateAnimalMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Animal> }) => updateAnimal(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["animals"] });
            const previousAnimals = queryClient.getQueryData<Animal[]>(["animals"]);

            queryClient.setQueryData<Animal[]>(["animals"], (old) => {
                if (!old) return old;
                return old.map(a => a.id === id ? { ...a, ...updates } as Animal : a);
            });

            return { previousAnimals };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(["animals"], context?.previousAnimals);
            addToast("error", `فشل في تحديث الحيوان: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals"] });
        },
        onSuccess: () => {
            addToast("success", "تم تحديث الحيوان بنجاح");
        }
    });

    const deleteAnimalMutation = useMutation({
        mutationFn: deleteAnimal,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["animals"] });
            const previousAnimals = queryClient.getQueryData<Animal[]>(["animals"]);

            queryClient.setQueryData<Animal[]>(["animals"], (old) => {
                return old ? old.filter(a => a.id !== id) : old;
            });

            return { previousAnimals };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["animals"], context?.previousAnimals);
            addToast("error", `فشل في حذف الحيوان: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals"] });
        },
        onSuccess: () => {
            addToast("success", "تم حذف الحيوان بنجاح");
        }
    });

    // Mutations - Vaccinations
    const createVaccinationMutation = useMutation({
        mutationFn: createVaccination,
        onMutate: async (newVax) => {
            await queryClient.cancelQueries({ queryKey: ["vaccinations"] });
            const prevVax = queryClient.getQueryData<VaccinationRecord[]>(["vaccinations"]);

            queryClient.setQueryData<VaccinationRecord[]>(["vaccinations"], (old) => {
                const optimisticVax = {
                    id: `temp-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    ...newVax,
                } as VaccinationRecord;
                return old ? [optimisticVax, ...old] : [optimisticVax];
            });

            return { prevVax };
        },
        onError: (err, newVax, context) => {
            queryClient.setQueryData(["vaccinations"], context?.prevVax);
            addToast("error", `فشل في إضافة التطعيم: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["vaccinations"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة التطعيم بنجاح");
        }
    });

    // Mutations - Feed
    const createFeedMutation = useMutation({
        mutationFn: createFeedRecord,
        onMutate: async (newFeed) => {
            await queryClient.cancelQueries({ queryKey: ["feed"] });
            const prevFeed = queryClient.getQueryData<FeedRecord[]>(["feed"]);

            queryClient.setQueryData<FeedRecord[]>(["feed"], (old) => {
                const optimisticFeed = {
                    id: `temp-${Date.now()}`,
                    farm_id: "temp",
                    created_at: new Date().toISOString(),
                    ...newFeed,
                } as FeedRecord;
                return old ? [optimisticFeed, ...old] : [optimisticFeed];
            });

            return { prevFeed };
        },
        onError: (err, newFeed, context) => {
            queryClient.setQueryData(["feed"], context?.prevFeed);
            addToast("error", `فشل في إضـافة سجل العلف: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
        },
        onSuccess: () => {
            addToast("success", "تم إضافة سجل العلف بنجاح");
        }
    });

    return {
        animals: animalsQuery.data || [],
        vaccinations: vaccinationsQuery.data || [],
        feedRecords: feedQuery.data || [],
        isLoading: animalsQuery.isLoading || vaccinationsQuery.isLoading || feedQuery.isLoading,
        createAnimal: createAnimalMutation.mutate,
        isCreatingAnimal: createAnimalMutation.isPending,
        updateAnimal: updateAnimalMutation.mutate,
        isUpdatingAnimal: updateAnimalMutation.isPending,
        deleteAnimal: deleteAnimalMutation.mutate,
        isDeletingAnimal: deleteAnimalMutation.isPending,
        createVaccination: createVaccinationMutation.mutate,
        isCreatingVaccination: createVaccinationMutation.isPending,
        createFeedRecord: createFeedMutation.mutate,
        isCreatingFeed: createFeedMutation.isPending,
    };
}
