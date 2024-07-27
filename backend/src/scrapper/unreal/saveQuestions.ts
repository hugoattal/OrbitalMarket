import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import * as UnrealAPI from "./api";

import ProductModel from "@/modules/product/model";

async function init() {
    await connectDatabase();
    const products = await ProductModel.find({}).select("meta.unrealId").exec();
    const totalProducts = products.length;
    let productNum = 0;
    let previousPercentage = "";
    for (const product of products) {
        const currentPercentage = `${ Math.round(productNum++ / totalProducts * 100 * 100) / 100 }%`;
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(currentPercentage);
        }

        if (product.meta) {
            await UnrealAPI.saveComments(product.meta.unrealId, "questions");
        }
    }
    await closeDatabase();
}

init().then();
