import { getAnimals, getVaccinations, getFeedRecords } from "@/lib/actions/livestock";
import ClientLivestock from "./ClientLivestock";

export default async function LivestockPage() {
    const animals = await getAnimals();
    const vaccinations = await getVaccinations();
    const feed = await getFeedRecords();

    return <ClientLivestock initialAnimals={animals} initialVaccinations={vaccinations} initialFeed={feed} />;
}
