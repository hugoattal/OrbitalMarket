import ProductModel from "../model";
import _ from "lodash";
import { differenceInDays } from "date-fns";

export async function updateScores() {
    const products = await ProductModel.aggregate([{
        $project: {
            releaseDate: true,
            ratings: true,
            "price.value": true,
            "computed.isBoosted": true,
            "meta.verificationReviews": true
        }
    }]);

    await ProductModel.bulkWrite(
        products.map(product => ({
            updateOne: {
                filter: { _id: product._id },
                update: {
                    "computed.score": computeScore(product.ratings, product.releaseDate, product.price.value === 0, product.computed.isBoosted, product.meta?.verificationReviews)
                }
            } as any // Fix weird typescript circular reference, probably a bug in mongoose typing
        })
        ));
}

export function computeScore(ratings: Array<number>, releaseDate: Date, isFree: boolean, isBoosted: boolean, verificationReviews = 0): { value: number, totalRatings: number, meanRating: number } {
    const totalRatings = _.sum(ratings);

    if (totalRatings === 0) {
        return { value: 0, totalRatings: 0, meanRating: 0 };
    }

    const verificationPenalty = verificationReviews * 0.8;

    const meanRating = getMeanRating(ratings);
    const elapsedDays = differenceInDays(Date.now(), releaseDate);
    const starsDivider = isFree ? 10 : 1;
    let value = Math.pow(meanRating, 2) * Math.sqrt(((totalRatings - verificationPenalty) / starsDivider) / (elapsedDays + 30)) * 1000 + 1 / (elapsedDays + 30) + 1;

    if (isBoosted) {
        value *= 1.5;
    }

    return {
        value,
        totalRatings,
        meanRating
    };
}

function getMeanRating(ratings: Array<number>) {
    const maxScore = ratings.length - 1;
    const totalRatings = _.sum(ratings);
    let meanRating = 0;

    for (let star = 0; star < ratings.length; star++) {
        meanRating += ratings[star] * star / (totalRatings * maxScore);
    }

    return meanRating;
}
