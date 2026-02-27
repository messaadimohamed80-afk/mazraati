import { getExpenses, getCategories } from "@/lib/actions/expenses";
import ClientExpenses from "./ClientExpenses";

export default async function ExpensesPage() {
    // Fetch data directly on the server (no useEffect, no loading spinners)
    const expensesR = await getExpenses();
    const categoriesR = await getCategories();
    const expenses = expensesR.ok ? expensesR.data : [];
    const categories = categoriesR.ok ? categoriesR.data : [];

    return <ClientExpenses initialExpenses={expenses} initialCategories={categories} />;
}
