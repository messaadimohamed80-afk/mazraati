import { getInventory } from "@/lib/actions/inventory";
import ClientInventory from "./ClientInventory";

export default async function InventoryPage() {
    const inventoryR = await getInventory();
    const inventory = inventoryR.ok ? inventoryR.data : [];
    return <ClientInventory initialInventory={inventory} />;
}
