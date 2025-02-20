import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import OldProductModel from "@/modules/product/old-model";
import { ProductModel } from "@/modules/product/model";

async function init() {
    await connectDatabase();

    const products = await ProductModel.find({
        "meta.unrealId": { $exists: 0 },
        releaseDate: { $gt: new Date("2024-10-01") }
    });

    let progress = 0;

    for (const product of products) {
        console.log(`Progress: ${ progress++ } / ${ products.length }`);

        const oldProduct = await OldProductModel.findOne({ title: product.title, owner: product.owner });

        if (oldProduct) {
            console.log("Fixing", product.title);

            product.meta.unrealId = oldProduct.meta.unrealId;
            product.releaseDate = oldProduct.releaseDate;

            product.markModified("meta");

            await product.save();
            continue;
        }

        const oldProducts2 = await OldProductModel.find({
            "computed.embeddedContent": product.computed.embeddedContent
        });

        if (oldProducts2.length === 1){
            console.log("Fixing", product.title);

            const oldProduct2 = oldProducts2[0];

            product.meta.unrealId = oldProduct2.meta.unrealId;
            product.releaseDate = oldProduct2.releaseDate;

            product.markModified("meta");

            await product.save();
            continue;
        }
    }


    await closeDatabase();
}


init().then(() => console.log("Done")).catch(console.error);
