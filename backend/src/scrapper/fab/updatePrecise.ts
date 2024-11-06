import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { ProductModel } from "@/modules/product/model";
import { updateFabPreciseProduct } from "@/scrapper/fab/lib/precise";

async function init() {
    await connectDatabase();
    const products = await ProductModel.find({
        "media.images": { $size: 0 }
    });

    let count = 0;


    for (const product of products) {
        count++;
        console.log(`${ Math.floor(count / products.length * 10000) / 100 }% (${ count }/${ products.length }) - ${ product.title }`);

        await updateFabPreciseProduct(product);
    }

    await closeDatabase();
}

init().then(console.log).catch(console.error);
