import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { getRedirect } from "@/scrapper/unreal/browser";
import ProductModel from "@/modules/product/old-model";

async function init() {
    await connectDatabase();

    const missingProducts = await ProductModel.find({
        "meta.fabId": { $exists: false }
    });

    let count = 0;

    for (const product of missingProducts) {
        count++;
        console.log(`Count: ${ count } / ${ missingProducts.length } (${ product.title })`);

        const target = `https://www.unrealengine.com/marketplace/en-US/product/${ product.slug }`;

        // Get 301 redirect of target from fetch

        const redirect = await getRedirect(target);

        if (redirect.startsWith("https://www.fab.com/listings/")) {
            product.meta.fabId = redirect.split("/").pop();
            product.markModified("meta");
            await product.save();
            console.log(`Product found: ${ product.meta.fabId }`);
        }
    }

    await closeDatabase();
}

init().then(console.log).catch(console.error);
