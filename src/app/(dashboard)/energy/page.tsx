import { getSolarPanels, getElectricityMeters, getGenerators } from "@/lib/actions/energy";
import ClientEnergy from "./ClientEnergy";

export default async function EnergyPage() {
    const [solar, electricity, generators] = await Promise.all([
        getSolarPanels(),
        getElectricityMeters(),
        getGenerators(),
    ]);

    return <ClientEnergy initialSolar={solar} initialElectricity={electricity} initialGenerators={generators} />;
}
