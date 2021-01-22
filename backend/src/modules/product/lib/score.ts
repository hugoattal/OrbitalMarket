import ProductModel from "../model";
import _ from "lodash";
import { differenceInDays } from "date-fns";

export async function updateScores() {
    const products = await ProductModel.aggregate([{
        $project: {
            releaseDate: true,
            ratings: true,
            "price.value": true
        }
    }]);

    await ProductModel.bulkWrite(
        products.map(product => ({
                updateOne: {
                    filter: { _id: product._id },
                    update: {
                        "cache.score": computeScore(product.ratings, product.releaseDate, product.price.value === 0)
                    }
                }
            })
        ));

    function computeScore(ratings: Array<number>, releaseDate: Date, isFree: Boolean) {
        const totalStars = _.sum(ratings);

        if (totalStars === 0)
        {
            return 0;
        }

        const meanRating = getMeanRating(ratings);
        const elapsedDays = differenceInDays(Date.now(), releaseDate);

        const starsDivider = isFree ? 10 : 1;

        return Math.pow(meanRating, 1.5) * Math.pow(totalStars / starsDivider, 0.75) / Math.sqrt(elapsedDays + 5) * 1000;
    }

    function getMeanRating(ratings: Array<number>) {
        const maxScore = ratings.length - 1;
        const totalStars = _.sum(ratings);
        let meanRating = 0;

        for (let star = 0; star < ratings.length; star++) {
            meanRating += ratings[star] * star / (totalStars * maxScore);
        }

        return meanRating;
    }
}
