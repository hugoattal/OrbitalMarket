import Cron from "node-cron";
import { updateFabProducts } from "@/scrapper/fab/lib/update";


async function makeUpdate(): Promise<void> {
    await updateFabProducts();
}

export function register(): void {
    Cron.schedule("0 2 * * *", makeUpdate);
}
