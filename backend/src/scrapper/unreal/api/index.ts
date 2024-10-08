import { processProductData, updateConversionRate } from "@/scrapper/unreal/lib/processing";
import { processCommentData } from "@/scrapper/unreal/lib/review";
import { makeRequest } from "@/scrapper/unreal/browser";
import { sleep } from "@/utils/lib";
import { getSavedState, setSavedState } from "@/scrapper/unreal/lib/state";

export async function updateProducts(): Promise<void> {
    await updateConversionRate();

    const productsCount = await getProductsCount();
    const step = 100;

    const savedState = await getSavedState("product");

    for (let productIndex = savedState; productIndex < productsCount; productIndex += step) {
        console.log(`${ productIndex } / ${ productsCount }`);
        let tryFetch = 5;
        let productPage;
        while (tryFetch--) {
            try {
                productPage = await getProductPage(productIndex, step);
                tryFetch = 0;
            }
            catch (error) {
                console.error(`Error fetching the page (try ${ tryFetch })`);
                await sleep(1000);

                if (tryFetch === 0) {
                    console.log(error);
                    break;
                }
            }
        }

        if (!productPage) {
            throw new Error("Stopping the process");
        }

        for (const element of productPage.elements) {
            if (!element.catalogItemId) {
                continue;
            }
            await processProductData(element);
        }

        await setSavedState("product", productIndex);
    }

    await setSavedState("product", 0);
}

export async function saveComments(productId: string, type: "reviews" | "questions") {
    let reviewsCount = 40;
    const step = 40;

    for (let startReview = 0; startReview < reviewsCount; startReview += step) {
        let tryFetch = 5;
        let reviewPage;
        while (tryFetch--) {
            try {
                reviewPage = await getCommentsPage(startReview, step, productId, type);
                reviewsCount = reviewPage.paging.total;
                tryFetch = 0;
            }
            catch (error) {
                console.error(error);
                console.error(`Error fetching the page (try ${ tryFetch })`);
            }
        }

        for (const element of reviewPage.elements) {
            await processCommentData(element, type);
        }
    }
}

// https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/assets?start=0&count=1&sortBy=effectiveDate&sortDir=ASC
export async function getProductPage(start: number, count: number) {
    const productUrl = new URL("https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/assets");
    productUrl.searchParams.append("start", start.toString());
    productUrl.searchParams.append("count", count.toString());
    productUrl.searchParams.append("sortBy", "effectiveDate");
    productUrl.searchParams.append("sortDir", "ASC");

    const productPage = await makeRequest(productUrl.toString());

    return productPage.data;
}

// https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/review/5cb2a394d0c04e73891762be4cbd7216/reviews/list?start=0&count=1&sortBy=CREATEDAT&sortDir=DESC
export async function getCommentsPage(start: number, count: number, productId: string, type: "questions" | "reviews") {
    const commentsUrl = new URL(`https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/review/${ productId }/${ type }/list`);
    commentsUrl.searchParams.append("start", start.toString());
    commentsUrl.searchParams.append("count", count.toString());
    commentsUrl.searchParams.append("sortBy", "CREATEDAT");
    commentsUrl.searchParams.append("sortDir", "ASC");

    const commentPage = await makeRequest(commentsUrl.toString());

    return commentPage.data;
}

export async function getProduct(productId: string) {
    const product = await makeRequest(`https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/assets/asset/${ productId }`);
    return product.data.data;
}

export async function getRating(productId: string) {
    const rating = await makeRequest(`https://marketplace-website-node-launcher-prod.ol.epicgames.com/ue/marketplace/api/review/${ productId }/ratings`);
    return rating.data.data;
}

export async function getProductsCount() {
    const productPage = await getProductPage(0, 1);
    return productPage.paging.total;
}

export async function getConversionRate() {
    const VoxelPlugin = await getProduct("b08e5581837e4bbca486b61cdf2751bb");
    const VoxelPluginPriceInEuro = VoxelPlugin.priceValue;
    const VoxelPluginPriceInUSD = 34999;
    return VoxelPluginPriceInUSD / VoxelPluginPriceInEuro;
}
