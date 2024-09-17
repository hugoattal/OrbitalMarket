import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import * as UnrealAPI from "./api";

async function init() {
    await connectDatabase();
    await UnrealAPI.updateProducts();
    await closeDatabase();
}

init().then(console.log).catch(console.error);
