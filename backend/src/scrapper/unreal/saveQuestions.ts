import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import * as UnrealAPI from "./api";

import ProductModel from "@/modules/product/old-model";
import { getSavedState, setSavedState } from "@/scrapper/unreal/lib/state";

async function init() {
    await connectDatabase();
    const products = await ProductModel.find({}).select("meta.unrealId").exec();
    const totalProducts = products.length;
    const savedState = await getSavedState("question");
    let previousPercentage = "";
    for (let productIndex = savedState; productIndex < totalProducts; productIndex++) {
        const currentPercentage = `${ Math.round(productIndex / totalProducts * 100 * 100) / 100 }%`;
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(currentPercentage);
        }

        const product = products[productIndex];

        if (product.meta) {
            await UnrealAPI.saveComments(product.meta.unrealId, "questions");
        }

        await setSavedState("question", productIndex);
    }

    await setSavedState("question", 0);
    await closeDatabase();
}

init().then(console.log).catch(console.error);
