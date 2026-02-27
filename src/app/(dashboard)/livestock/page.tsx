import { getAnimals, getVaccinations, getFeedRecords } from "@/lib/actions/livestock";
import ClientLivestock from "./ClientLivestock";

export default async function LivestockPage() {
    const animalsR = await getAnimals();
    const vaccinationsR = await getVaccinations();
    const feedR = await getFeedRecords();

    const animals = animalsR.ok ? animalsR.data : [];
    const vaccinations = vaccinationsR.ok ? vaccinationsR.data : [];
    const feed = feedR.ok ? feedR.data : [];

    return <ClientLivestock initialAnimals={animals} initialVaccinations={vaccinations} initialFeed={feed} />;
}
