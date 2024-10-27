import Cron from "node-cron";
import * as UnrealAPI from "@/scrapper/unreal/api";


async function makeUpdate(): Promise<void> {
    await UnrealAPI.updateProducts();
}

export function register(): void {
    //Cron.schedule("0 2 * * *", makeUpdate); // For now until I get it working with Fab
}
