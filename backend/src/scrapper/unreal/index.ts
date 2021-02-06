import "module-alias/register";
import { connectDatabase, closeDatabase } from "@/database";
import * as UnrealAPI from "./api";
import { processProductData } from "@/scrapper/unreal/lib/processing";

async function init() {
    await connectDatabase();
    await loadProducts();
    await closeDatabase();
}

init().then();

async function loadProducts() {
    const productsCount = await UnrealAPI.getProductsCount();
    const step = 100;

    for (let startProduct = 0; startProduct < productsCount; startProduct += step) {
        console.log(startProduct + " / " + productsCount);
        const productPage = await UnrealAPI.getProductPage(startProduct, 100);

        for (const element of productPage.elements) {
            await processProductData(element);
        }
    }
}
