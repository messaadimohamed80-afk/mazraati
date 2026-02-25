import { getExpenses, getCategories } from "@/lib/actions/expenses";
import ClientExpenses from "./ClientExpenses";

export default async function ExpensesPage() {
    // Fetch data directly on the server (no useEffect, no loading spinners)
    const expenses = await getExpenses();
    const categories = await getCategories();

    return <ClientExpenses initialExpenses={expenses} initialCategories={categories} />;
}
