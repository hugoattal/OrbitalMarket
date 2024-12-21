import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import { ProductModel } from "@/modules/product/model";
import { computeScore } from "@/scrapper/fab/lib/score";
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
