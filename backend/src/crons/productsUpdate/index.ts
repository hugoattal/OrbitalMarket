import Cron from "node-cron";
import { updateFabProducts } from "@/scrapper/fab/lib/update";
import { updateFabMissingProducts, updateFabPreciseProducts } from "@/scrapper/fab/lib/precise";


async function makeUpdate(): Promise<void> {
    await updateFabProducts();
}

async function makeMissingUpdate(): Promise<void> {
    await updateFabMissingProducts();
}

async function makePreciseUpdate(): Promise<void> {
    await updateFabPreciseProducts();
}

export function register(): void {
    Cron.schedule("0 0 * * *", makeUpdate);
    //Cron.schedule("0 5 * * *", makeMissingUpdate);
    Cron.schedule("0 6 * * *", makePreciseUpdate);
}
