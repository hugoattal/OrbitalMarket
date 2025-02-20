import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { ProductModel } from "@/modules/product/model";
import { stringSimilarity } from "string-similarity-js";

async function init() {
    await connectDatabase();

    const products = await ProductModel.find({}).lean();

    const filteredProducts = products
        .filter(product => product.description?.short && product.description.short.length >= 300)
        .map(product => ({
            id: product.meta.fabId,
            title: product.title,
            description: product.description.short,
            owner: product.owner.toString(),
            releaseDate: product.releaseDate
        }));

    const total = filteredProducts.length;
    let current = 0;

    filteredProducts.sort((a, b) => b.releaseDate - a.releaseDate);

    console.log(`Total: ${ total }`);

    while (filteredProducts.length > 10) {
        const productA = filteredProducts.pop();

        current++;

        if (current % 100 === 0) {
            console.log(`Progress: ${ Math.round(current / total * 100) }% (${ current } / ${ total })`);
        }

        if (current < 1100) {
            continue;
        }

        for (const productB of filteredProducts) {
            if (productA.owner === productB.owner){
                continue;
            }

            const match = stringSimilarity(productA.description, productB.description);

            if (match > 0.8) {
                console.log(`Math ${ Math.round(match * 100) }% // ${ productA.title } (${ productA.id }) - ${ productB.title } (${ productB.id })`);
            }
        }
    }

    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
