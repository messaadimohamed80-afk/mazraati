import { getInventory } from "@/lib/actions/inventory";
import ClientInventory from "./ClientInventory";

export default async function InventoryPage() {
    const inventory = await getInventory();
    return <ClientInventory initialInventory={inventory} />;
}
