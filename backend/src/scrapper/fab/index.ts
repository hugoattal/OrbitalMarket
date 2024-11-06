import "module-alias/register";
import { updateFabProducts } from "@/scrapper/fab/lib/update";

async function init() {
    await updateFabProducts();
}


init().then(() => console.log("Done")).catch(console.error);
