import { getCrops } from "@/lib/actions/crops";
import ClientCrops from "./ClientCrops";

export default async function CropsPage() {
    const crops = await getCrops();
    return <ClientCrops initialCrops={crops} />;
}
