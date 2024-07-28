import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import * as UnrealAPI from "./api";

import ProductModel from "@/modules/product/model";
import ReviewModel from "@/modules/review/model";

async function init() {
    await connectDatabase();
    const products = await ProductModel.find({}).select({ "meta.unrealId": 1, "ratings": 1 }).exec();
    const totalProducts = products.length;
    let productNum = 0;
    let previousPercentage = "";
    for (const product of products) {
        const currentPercentage = `${ Math.round(productNum++ / totalProducts * 100 * 100) / 100 }%`;
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(`${ currentPercentage } (${ productNum })`);
        }

        const expectedReviews = product.ratings.reduce((a, b) => a + b, 0);
        const existingReviews = await ReviewModel.countDocuments({ "meta.target": product.meta.unrealId }).exec();

        if (expectedReviews === existingReviews) {
            continue;
        }

        if (product.meta) {
            await UnrealAPI.saveComments(product.meta.unrealId, "reviews");
        }
    }
    await closeDatabase();
}

init().then();
