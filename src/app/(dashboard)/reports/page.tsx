import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals, getFeedRecords } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";
import { getWells } from "@/lib/actions/water";
import ClientReports from "./ClientReports";

export default async function ReportsPage() {
    // Fetch all necessary data parallelly for the report page
    const [
        expenses,
        categories,
        crops,
        tasks,
        animals,
        feed,
        inventory,
        wells
    ] = await Promise.all([
        getExpenses(),
        getCategories(),
        getCrops(),
        getTasks(),
        getAnimals(),
        getFeedRecords(),
        getInventory(),
        getWells(),
    ]);

    return (
        <ClientReports
            initialExpenses={expenses}
            initialCategories={categories}
            initialCrops={crops}
            initialTasks={tasks}
            initialAnimals={animals}
            initialFeed={feed}
            initialInventory={inventory}
            initialWells={wells}
        />
    );
}
