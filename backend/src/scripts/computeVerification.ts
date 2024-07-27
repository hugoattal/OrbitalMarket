import "module-alias/register";
import { closeDatabase, connectDatabase } from "@/database";
import ProductModel from "../modules/product/model";
import ReviewModel from "@/modules/review/model";

async function init() {
    await connectDatabase();

    const products = await ProductModel.find({}).select({ "meta.unrealId": 1 });

    const totalProducts = products.length;
    let productNum = 0;
    let previousPercentage = "";

    for (const product of products) {
        const currentPercentage = `${ Math.round(productNum++ / totalProducts * 100) }%`;
        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(currentPercentage);
        }

        const reviews = await ReviewModel.find({ "meta.target": product.meta.unrealId }).exec();

        const flaggedReviews = reviews.map((review) => {
            const name = review.name.toLowerCase();

            if (name.includes("discord") || name.includes("verification") || name.includes("verify")) {
                return true;
            }

            if (review.content.length < 32) {
                return true;
            }

            const content = review.content.toLowerCase();

            if ((
                content.includes("discord")
                    || content.includes("verification")
                    || content.includes("verify")
                || /#[0-9]{4}/.test(content)
            )
                && review.content.length < 64) {
                return true;
            }

            return false;
        });

        const verificationRatio = flaggedReviews.length ? 1 - flaggedReviews.filter((flagged) => flagged).length / flaggedReviews.length : 1;

        await ProductModel.updateOne({ _id: product._id }, { $set: { "meta.verificationRatio": verificationRatio } });
    }

    await closeDatabase();
}

init().then();
