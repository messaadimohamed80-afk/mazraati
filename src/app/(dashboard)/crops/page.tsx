import { getCrops } from "@/lib/actions/crops";
import ClientCrops from "./ClientCrops";

function getServerTimestamp() { return Date.now(); }

export default async function CropsPage() {
    const crops = await getCrops();
    return <ClientCrops initialCrops={crops} serverNow={getServerTimestamp()} />;
}
