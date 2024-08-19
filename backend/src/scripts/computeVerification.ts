import "module-alias/register";
import { connectDatabase } from "@/database";
import ProductModel from "../modules/product/model";
import ReviewModel from "@/modules/review/model";

async function init() {
    await connectDatabase();

    const products = await ProductModel.find({}).select({ "meta.unrealId": 1 });
    const productIds = products.map(product => product.meta.unrealId);

    const reviews = await ReviewModel.find({ "meta.target": { $in: productIds } }).exec();

    const reviewsByProduct = reviews.reduce((acc, review) => {
        const productId = review.meta.target;
        if (!acc[productId]) {
            acc[productId] = [];
        }
        acc[productId].push(review);
        return acc;
    }, {});

    const totalProducts = products.length;
    let productNum = 0;
    let previousPercentage = "";

    const bulkOperations = [];

    for (const product of products) {
        const currentPercentage = `${ Math.round(productNum++ / totalProducts * 100) }%`;

        if (currentPercentage !== previousPercentage) {
            previousPercentage = currentPercentage;
            console.log(currentPercentage);
        }

        const productReviews = reviewsByProduct[product.meta.unrealId] || [];

        const flaggedReviews = productReviews.map((review) => {
            const title = review.title.toLowerCase();

            if (title.includes("discord") || title.includes("verification") || title.includes("verify")) {
                return true;
            }

            const content = review.content.toLowerCase();

            if ((
                content.includes("discord")
                    || content.includes("verification")
                    || content.includes("verify")
                || /#[0-9]{4}/.test(content)
            )
                && content.length < 64) {
                return true;
            }

            if (content.split(" ").length <= 1) {
                return true;
            }

            return false;
        });

        const verificationRatio = flaggedReviews.length ? 1 - flaggedReviews.filter((flagged) => flagged).length / flaggedReviews.length : 1;

        bulkOperations.push({
            updateOne: {
                filter: { _id: product._id },
                update: { $set: { "meta.verificationRatio": verificationRatio } }
            }
        });
    }

    await ProductModel.bulkWrite(bulkOperations);
}

init().then(
    () => {
        console.log("Verification computed");
        process.exit(0);
    },
    (error) => {
        console.error(error);
        process.exit(1);
    }
);
