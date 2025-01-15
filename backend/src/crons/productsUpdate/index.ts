import Cron from "node-cron";
import { updateFabProducts } from "@/scrapper/fab/lib/update";
import { updateFabPreciseProducts } from "@/scrapper/fab/lib/precise";


async function makeUpdate(): Promise<void> {
    await updateFabProducts();
}

async function makePreciseUpdate(): Promise<void> {
    await updateFabPreciseProducts();
}

export function register(): void {
    Cron.schedule("0 2 * * *", makeUpdate);
    Cron.schedule("0 5 * * *", makePreciseUpdate);
}
