import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import * as UnrealAPI from "./api";

import ProductModel from "@/modules/product/old-model";
import ReviewModel from "@/modules/review/model";
import { getSavedState, setSavedState } from "@/scrapper/unreal/lib/state";

async function init() {
    await connectDatabase();
    const products = await ProductModel.find({}).select({ "meta.unrealId": 1, "ratings": 1 }).exec();
    const totalProducts = products.length;
    const savedState = await getSavedState("review");
    let previousPercentage = "";
    for (let productIndex = savedState; productIndex < totalProducts; productIndex++) {

        const currentPercentage = `${ Math.round(productIndex / totalProducts * 100 * 100) / 100 }%`;
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(`${ currentPercentage } (${ productIndex })`);
        }

        const product = products[productIndex];

        const expectedReviews = product.ratings.reduce((a, b) => a + b, 0);
        const existingReviews = await ReviewModel.countDocuments({ "meta.target": product.meta.unrealId }).exec();

        if (expectedReviews === existingReviews) {
            continue;
        }

        if (product.meta) {
            await UnrealAPI.saveComments(product.meta.unrealId, "reviews");
        }

        await setSavedState("review", productIndex);
    }

    await setSavedState("review", 0);
    await closeDatabase();
}

init().then(console.log).catch(console.error);
