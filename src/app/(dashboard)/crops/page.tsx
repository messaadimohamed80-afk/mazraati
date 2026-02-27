import { getCrops } from "@/lib/actions/crops";
import ClientCrops from "./ClientCrops";

function getServerTimestamp() { return Date.now(); }

export default async function CropsPage() {
    const cropsResult = await getCrops();
    const crops = cropsResult.ok ? cropsResult.data : [];
    return <ClientCrops initialCrops={crops} serverNow={getServerTimestamp()} />;
}
