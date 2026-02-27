import { getExpenses, getCategories } from "@/lib/actions/expenses";
import { getCrops, getTasks } from "@/lib/actions/crops";
import { getAnimals, getFeedRecords } from "@/lib/actions/livestock";
import { getInventory } from "@/lib/actions/inventory";
import { getWells } from "@/lib/actions/water";
import { getFarmSettings } from "@/lib/actions/settings";
import ClientReports from "./ClientReports";

export default async function ReportsPage() {
    // Fetch all necessary data parallelly for the report page
    const [
        expensesR,
        categoriesR,
        cropsR,
        tasksR,
        animalsR,
        feedR,
        inventoryR,
        wellsR,
        settingsR
    ] = await Promise.all([
        getExpenses(),
        getCategories(),
        getCrops(),
        getTasks(),
        getAnimals(),
        getFeedRecords(),
        getInventory(),
        getWells(),
        getFarmSettings(),
    ]);

    const expenses = expensesR.ok ? expensesR.data : [];
    const categories = categoriesR.ok ? categoriesR.data : [];
    const crops = cropsR.ok ? cropsR.data : [];
    const tasks = tasksR.ok ? tasksR.data : [];
    const animals = animalsR.ok ? animalsR.data : [];
    const feed = feedR.ok ? feedR.data : [];
    const inventory = inventoryR.ok ? inventoryR.data : [];
    const wells = wellsR.ok ? wellsR.data : [];
    const budget = settingsR.ok ? (settingsR.data.budget || 0) : 0;

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
            initialBudget={budget}
        />
    );
}
