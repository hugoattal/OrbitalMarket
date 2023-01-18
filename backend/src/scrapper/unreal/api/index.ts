import Axios from "axios";
import { processProductData, updateConversionRate } from "@/scrapper/unreal/lib/processing";
import { processReviewData } from "@/scrapper/unreal/lib/review";

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
            await processProductData(element);
        }
    }
}

export async function saveReviews(productId: string) {
    let reviewsCount = 40;
    const step = 40;

    for (let startReview = 0; startReview < reviewsCount; startReview += step) {
        //console.log(startReview + " / " + reviewsCount);
        let tryFetch = 5;
        let reviewPage;
        while (tryFetch--) {
            try {
                reviewPage = await getReviewPage(startReview, step, productId);
                reviewsCount = reviewPage.paging.total;
                tryFetch = 0;
            }
            catch (error) {
                console.error("Error fetching the page (try " + tryFetch + ")");
            }
        }

        for (const element of reviewPage.elements) {
            await processReviewData(element);
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

// https://www.unrealengine.com/marketplace/api/review/5cb2a394d0c04e73891762be4cbd7216/reviews/list?start=0&count=1&sortBy=CREATEDAT&sortDir=DESC
export async function getReviewPage(start: number, count: number, productId: string) {
    const reviewPage = await Axios.get("https://www.unrealengine.com/marketplace/api/review/" + productId + "/reviews/list",
        {
            params: {
                start,
                count,
                sortBy: "CREATEDAT",
                sortDir: "ASC"
            }
        });
    return reviewPage.data.data;
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

export async function getReviewsCount(productId: string) {
    const productPage = await getReviewPage(0, 1, productId);
    return productPage.paging.total;
}

export async function getConversionRate() {
    const VoxelPlugin = await getProduct("b08e5581837e4bbca486b61cdf2751bb");
    const VoxelPluginPriceInEuro = VoxelPlugin.data.priceValue;
    const VoxelPluginPriceInUSD = 34999;
    return VoxelPluginPriceInUSD / VoxelPluginPriceInEuro;
}
