import "module-alias/register";
import { makeRequest } from "@/scrapper/unreal/browser";
import { TProductModel } from "@/modules/product/model";

export async function updateFabPreciseProduct(product: TProductModel) {
    try {
        const fabId = product.meta.fabId;
        const apiUrl = `https://www.fab.com/i/listings/${ fabId }`;
        const data = await makeRequest(apiUrl);

        const images = data.medias.map((media) => {
            const images = media.images;
            images.sort((a, b) => b.width - a.width);
            return images[0].url;
        });

        product.media.images = images;
        product.isAI = data.isAiGenerated;
        product.dates.lastPrecise = new Date();

        product.markModified("media");
        product.markModified("dates");

        await product.save();
    }
    catch (error) {
        console.error(error);
    }

}
