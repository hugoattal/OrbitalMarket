import { closeDatabase, connectDatabase } from "@/database";
import * as ProductScore from "@/modules/product/lib/score";

async function init() {
    await connectDatabase();
    await ProductScore.updateScores();
    await closeDatabase();
}

init().then();
