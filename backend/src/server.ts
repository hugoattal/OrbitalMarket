import "module-alias/register";
import { connectDatabase } from "@/database";

async function init() {
    await connectDatabase();
    console.log("Work");
}

init().then();
