import "module-alias/register";
import { updateFabProducts } from "@/scrapper/fab/lib/update";
import { closeDatabase, connectDatabase } from "@/database";

async function init() {
    await connectDatabase();
    await updateFabProducts();
    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
