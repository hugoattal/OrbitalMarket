import "module-alias/register";
import { connectDatabase, closeDatabase } from "@/database";
import * as ProductScore from "@/modules/product/lib/score";

async function init() {
    await connectDatabase();
    await ProductScore.updateScores();
    await closeDatabase();
}

init().then();
