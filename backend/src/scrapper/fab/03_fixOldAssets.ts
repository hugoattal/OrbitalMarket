import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import OldProductModel, { IProductDocument } from "@/modules/product/old-model";
import { ProductModel, TProductModel } from "@/modules/product/model";

async function init() {
    await connectDatabase();

    //Find product with releaseDate less than 1 month ago

    const products = await ProductModel.find({ "meta.unrealId": { $exists: 0 }, releaseDate: { $gt: new Date("2024-10-01") } });

    console.log(products.length);

    for (const product of products) {
        const oldProduct = await OldProductModel.findOne({ title: product.title, owner: product.owner });

        if (oldProduct) {
            console.log("Fixing", product.title);

            product.meta.unrealId = oldProduct.meta.unrealId;
            product.releaseDate = oldProduct.releaseDate;

            product.markModified("meta");

            await product.save();
        }
    }


    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
