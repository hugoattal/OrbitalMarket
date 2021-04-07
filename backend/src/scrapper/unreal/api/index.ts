import Axios from "axios";
import { processProductData, updateConversionRate } from "@/scrapper/unreal/lib/processing";

export async function updateProducts(): Promise<void> {
    await updateConversionRate();

    const productsCount = await getProductsCount();
    const step = 100;

    for (let startProduct = 0; startProduct < productsCount; startProduct += step) {
        console.log(startProduct + " / " + productsCount);
        const productPage = await getProductPage(startProduct, 100);

        for (const element of productPage.elements) {
            await processProductData(element);
        }
    }
}

// https://www.unrealengine.com/marketplace/api/assets?start=0&count=1&sortBy=effectiveDate&sortDir=ASC
export async function getProductPage(start: number, count: number) {
    const productPage = await Axios.get("https://www.unrealengine.com/marketplace/api/assets",
        {
            params: {
                start,
                count,
                sortBy: "effectiveDate",
                sortDir: "ASC"
            }
        });
    return productPage.data.data;
}

export async function getProduct(productId: string) {
    const product = await Axios.get(`https://www.unrealengine.com/marketplace/api/assets/asset/${productId}`);
    return product.data.data;
}

export async function getRating(productId: string) {
    const product = await Axios.get(`https://www.unrealengine.com/marketplace/api/review/${productId}/ratings`);
    return product.data.data;
}

export async function getProductsCount() {
    const productPage = await getProductPage(0, 1);
    return productPage.paging.total;
}

export async function getConversionRate() {
    const VoxelPlugin = await getProduct("b08e5581837e4bbca486b61cdf2751bb");
    const VoxelPluginPriceInEuro = VoxelPlugin.data.priceValue;
    const VoxelPluginPriceInUSD = 34999;
    return VoxelPluginPriceInUSD / VoxelPluginPriceInEuro;
}
