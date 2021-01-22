import Axios from "axios";


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
