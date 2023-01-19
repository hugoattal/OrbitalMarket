import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import ProductModel from "../modules/product/model";
import ReviewModel from "@/modules/review/model";

async function init() {
    await connectDatabase();

    const products = await ProductModel.find({}).select({ "meta.unrealId": 1 }).exec();

    const totalProducts = products.length;
    let productNum = 0;
    let previousPercentage = "";

    for (const product of products) {
        const currentPercentage = Math.round(productNum++ / totalProducts * 100) + "%";
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(currentPercentage);
        }

        const verificationReviews = await ReviewModel.count({
            "meta.target": product.meta.unrealId,
            content: { $regex: /#[0-9]{4}/ }
        }).exec();
        await ProductModel.updateOne({ _id: product._id }, { $set: { "meta.verificationReviews": verificationReviews } }).exec();
    }

    await closeDatabase();
}

init().then();
