import { processProductData, updateConversionRate } from "@/scrapper/unreal/lib/processing";
import { processCommentData } from "@/scrapper/unreal/lib/review";
import { makeRequest } from "@/scrapper/unreal/browser";

export async function updateProducts(): Promise<void> {
    await updateConversionRate();

    const productsCount = await getProductsCount();
    const step = 100;

    for (let startProduct = 0; startProduct < productsCount; startProduct += step) {
        console.log(startProduct + " / " + productsCount);
        let tryFetch = 5;
        let productPage;
        while (tryFetch--) {
            try {
                productPage = await getProductPage(startProduct, step);
                tryFetch = 0;
            }
            catch (error) {
                console.error("Error fetching the page (try " + tryFetch + ")");
            }
        }

        for (const element of productPage.elements) {
            if (!element.catalogItemId) {
                continue;
            }
            await processProductData(element);
        }
    }
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
                console.error("Error fetching the page (try " + tryFetch + ")");
            }
        }

        for (const element of reviewPage.elements) {
            await processCommentData(element, type);
        }
    }
}

// https://www.unrealengine.com/marketplace/api/assets?start=0&count=1&sortBy=effectiveDate&sortDir=ASC
export async function getProductPage(start: number, count: number) {
    const productUrl = new URL("https://www.unrealengine.com/marketplace/api/assets");
    productUrl.searchParams.append("start", start.toString());
    productUrl.searchParams.append("count", count.toString());
    productUrl.searchParams.append("sortBy", "effectiveDate");
    productUrl.searchParams.append("sortDir", "ASC");

    const productPage = await makeRequest(productUrl.toString());

    return productPage.data;
}

// https://www.unrealengine.com/marketplace/api/review/5cb2a394d0c04e73891762be4cbd7216/reviews/list?start=0&count=1&sortBy=CREATEDAT&sortDir=DESC
export async function getCommentsPage(start: number, count: number, productId: string, type: "questions" | "reviews") {
    const commentsUrl = new URL(`https://www.unrealengine.com/marketplace/api/review/${productId}/${type}/list`);
    commentsUrl.searchParams.append("start", start.toString());
    commentsUrl.searchParams.append("count", count.toString());
    commentsUrl.searchParams.append("sortBy", "CREATEDAT");
    commentsUrl.searchParams.append("sortDir", "ASC");

    const commentPage = await makeRequest(commentsUrl.toString());

    return commentPage.data;
}

export async function getProduct(productId: string) {
    const product = await makeRequest(`https://www.unrealengine.com/marketplace/api/assets/asset/${productId}`);
    return product.data.data;
}

export async function getRating(productId: string) {
    const rating = await makeRequest(`https://www.unrealengine.com/marketplace/api/review/${productId}/ratings`);
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
