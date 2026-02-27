import { getWells, getTanks, getIrrigation } from "@/lib/actions/water";
import ClientWater from "./ClientWater";

export default async function WaterPage() {
    const wellsR = await getWells();
    const tanksR = await getTanks();
    const irrigationR = await getIrrigation();

    const wells = wellsR.ok ? wellsR.data : [];
    const tanks = tanksR.ok ? tanksR.data : [];
    const irrigation = irrigationR.ok ? irrigationR.data : [];

    return <ClientWater initialWells={wells} initialTanks={tanks} initialIrrigation={irrigation} />;
}
