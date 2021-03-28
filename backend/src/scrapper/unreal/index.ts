import "module-alias/register";
import { connectDatabase, closeDatabase } from "@/database";
import * as UnrealAPI from "./api";

async function init() {
    await connectDatabase();
    await UnrealAPI.updateProducts();
    await closeDatabase();
}

init().then();
