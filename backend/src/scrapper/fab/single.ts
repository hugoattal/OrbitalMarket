import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { updateFabPreciseProduct } from "@/scrapper/fab/lib/precise";
import { ProductModel } from "@/modules/product/model";

async function init() {
    await connectDatabase();
    const ids = process.argv.slice(2);

    for (const id of ids) {
        const product = await ProductModel.findOne({ meta: { fabId: id } }).exec();
        if (product) {
            console.log(`Updating ${ product.title }`);
            await updateFabPreciseProduct(product);
        }
        else {
            console.log(`Product not found: ${ id }`);
        }
    }

    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
