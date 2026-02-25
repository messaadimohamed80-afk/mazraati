import { getWells, getTanks, getIrrigation } from "@/lib/actions/water";
import ClientWater from "./ClientWater";

export default async function WaterPage() {
    const wells = await getWells();
    const tanks = await getTanks();
    const irrigation = await getIrrigation();

    return <ClientWater initialWells={wells} initialTanks={tanks} initialIrrigation={irrigation} />;
}
