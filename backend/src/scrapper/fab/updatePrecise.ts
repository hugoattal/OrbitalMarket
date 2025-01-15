import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { updateFabPreciseProducts } from "@/scrapper/fab/lib/precise";

async function init() {
    await connectDatabase();

    await updateFabPreciseProducts();

    await closeDatabase();
}

init().then(console.log).catch(console.error);
