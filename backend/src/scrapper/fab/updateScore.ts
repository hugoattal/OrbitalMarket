import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import OldProductModel, { IProductDocument } from "@/modules/product/old-model";
import { makeRequest } from "@/scrapper/unreal/browser";
import * as ProductService from "@/modules/product/service";
import { ProductModel, TProductModel } from "@/modules/product/model";
import { computeScore, getIsBoosted } from "@/scrapper/fab/lib/score";
import { getEmbeddedContent } from "@/scrapper/fab/lib/embed";
import UserModel from "@/modules/user/model";

async function init() {
    await connectDatabase();


    const cursor = ProductModel.find({}).cursor();

    let count = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        count++;

        if (count % 100 === 0) {
            console.log(`Count: ${ count }`);
        }

        const product = doc.toObject();

        const score = computeScore(product.review.rating, product.review.count, new Date(product.releaseDate), product.price.value === 0, product.computed.isBoosted);

        await ProductModel.updateOne({ _id: product._id }, {
            "computed.score": score
        }).exec();
    }

    await closeDatabase();
}

init().then(console.log).catch(console.error);
