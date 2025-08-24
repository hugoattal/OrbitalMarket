import "module-alias/register";
import { makeRequest } from "@/scrapper/unreal/browser";
import { ProductModel, TProductModel } from "@/modules/product/model";
import * as cheerio from "cheerio";
import { addComputed } from "@/scrapper/fab/lib/update";

export async function updateFabPreciseProduct(product: TProductModel) {
    try {
        const fabId = product.meta.fabId;
        const apiUrl = `https://www.fab.com/i/listings/${ fabId }`;

        const data = await makeRequest(apiUrl);

        product.dates.lastPrecise = new Date();

        if (data?.detail) {
            if (data.detail.startsWith("Mature")) {
                product.isMature = true;
                await product.save();
                return;
            }

            product.skip = true;
            await product.save();
            return;
        }

        const images = data.medias
            .filter((media) => media.type === "image")
            .map((media) => {
                const images = media.images;
                images.sort((a, b) => b.width - a.width);
                return images[0].url;
            });

        product.media.images = images;
        product.isAI = data.isAiGenerated;

        product.description.long = data.description;
        product.description.long = product.description.long.replaceAll(`<a href="`, `<a target="_blank" href="`);

        product.description.short = cheerio.load(data.description).text();

        addComputed(product);

        product.markModified("media");
        product.markModified("description");
        product.markModified("dates");
        product.markModified("computed");

        await product.save();
    }
    catch (error) {
        console.log(`Error updating (precise) product ${ product.meta.fabId } (https://www.fab.com/i/listings/${ product.meta.fabId })`);
        console.error(error);
    }
}

export async function updateFabMissingProducts() {
    const products = await ProductModel.find({
        "isMature": { $ne: true },
        "media.images": { $size: 0 },
        "skip": { $ne: true }
    });

    console.log(`Found ${ products.length } products without images`);

    for (const product of products) {
        await updateFabPreciseProduct(product);
    }
}

export async function updateFabPreciseProducts() {
    const products = await ProductModel.find({
        "dates.lastPrecise": { $exists: true },
        "dates.lastTouched": { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        "review.count": { $gt: 0 }
    }).sort({
        "dates.lastPrecise": 1
    });

    const limit = Math.ceil(products.length * 0.1);
    const productsToFix = products.slice(0, limit);
    let progress = 0;

    for (const product of productsToFix) {
        console.log(`Progress: ${ progress++ } / ${ productsToFix.length }`);

        await updateFabPreciseProduct(product);
    }
}
