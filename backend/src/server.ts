import "module-alias/register";
import { connectDatabase, closeDatabase } from "@/database";
import * as ConfigService from "@/modules/config/service";

async function init() {
    await connectDatabase();
    console.log(await ConfigService.doesConfigExist());
    await closeDatabase();
}

init().then();
