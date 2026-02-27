import { getSolarPanels, getElectricityMeters, getGenerators } from "@/lib/actions/energy";
import ClientEnergy from "./ClientEnergy";

export default async function EnergyPage() {
    const [solarR, electricityR, generatorsR] = await Promise.all([
        getSolarPanels(),
        getElectricityMeters(),
        getGenerators(),
    ]);
    const solar = solarR.ok ? solarR.data : [];
    const electricity = electricityR.ok ? electricityR.data : [];
    const generators = generatorsR.ok ? generatorsR.data : [];

    return <ClientEnergy initialSolar={solar} initialElectricity={electricity} initialGenerators={generators} />;
}
