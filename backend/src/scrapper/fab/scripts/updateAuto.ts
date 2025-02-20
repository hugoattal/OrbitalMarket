import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import ProductModel from "@/modules/product/old-model";
import UserModel from "@/modules/user/model";
import { makeRequest } from "@/scrapper/unreal/browser";

async function init() {
    await connectDatabase();

    let apiUrl = "https://www.fab.com/i/listings/search?channels=unreal-engine&currency=USD&sort_by=createdAt";
    let data = await makeRequest(apiUrl);

    let count = 0;
    let failedCount = 0;
    let previousCount = 0;

    while (data.results.length) {
        count += data.results.length;

        if (Math.floor(count / 250) > Math.floor(previousCount / 250)) {
            previousCount = count;
            console.log(`Count: ${ count } / Match: ${ Math.round((1 - failedCount / count) * 100) }% (url: ${ apiUrl })`);
        }

        for (const product of data.results) {
            const existingProducts = await ProductModel.find({
                title: product.title
            });

            if (existingProducts.length === 1) {
                const existingProduct = existingProducts[0];
                existingProduct.meta.fabId = product.uid;
                existingProduct.markModified("meta");
                await existingProduct.save();
            }
            else {
                console.log(`__Product (${ existingProducts.length } by ${ product.user.sellerName }): ${ product.title }`);

                if (existingProducts.length > 1) {
                    const owner = await UserModel.findOne({
                        name: product.user.sellerName
                    });

                    if (!owner) {
                        console.log(`x Owner not found`);
                        failedCount++;
                        continue;
                    }

                    const productTest = await ProductModel.find({
                        title: product.title,
                        owner: owner._id
                    });

                    if (productTest.length === 1) {
                        const existingProduct = productTest[0];
                        existingProduct.meta.fabId = product.uid;
                        existingProduct.markModified("meta");
                        await existingProduct.save();
                        console.log(`o Product found`);
                        continue;
                    }
                }

                console.log("x Product not found");
                failedCount++;
            }
        }

        apiUrl = data.next;
        data = await makeRequest(apiUrl);
    }

    await closeDatabase();
}

init().then(console.log).catch(console.error);
