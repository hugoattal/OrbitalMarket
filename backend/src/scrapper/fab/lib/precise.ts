import "module-alias/register";
import { makeRequest } from "@/scrapper/unreal/browser";
import { ProductModel, TProductModel } from "@/modules/product/model";
import * as cheerio from "cheerio";

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

        product.description.long = data.description;
        product.description.long = product.description.long.replaceAll(`<a href="`, `<a target="_blank" href="`);

        product.description.short = cheerio.load(data.description).text();

        product.markModified("media");
        product.markModified("description");
        product.markModified("dates");

        await product.save();
    }
    catch (error) {
        console.error(error);
    }
}

export async function updateFabPreciseProducts() {
    const products = await ProductModel.find({
        "media.images": { $size: 0 }
    });

    for (const product of products) {
        await updateFabPreciseProduct(product);
    }
}
