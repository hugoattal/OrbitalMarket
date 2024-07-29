import ProductModel from "../model";
import _ from "lodash";
import { differenceInDays } from "date-fns";

export async function updateScores() {
    const products = await ProductModel.aggregate([{
        $project: {
            "computed.isBoosted": true,
            "meta.verificationRatio": true,
            "price.value": true,
            ratings: true,
            releaseDate: true
        }
    }]);

    await ProductModel.bulkWrite(
        products.map(product => ({
            updateOne: {
                filter: { _id: product._id },
                update: {
                    "computed.score": computeScore(
                        product.ratings,
                        product.releaseDate,
                        product.price.value === 0,
                        product.computed.isBoosted,
                        product.meta?.verificationRatio
                    )
                }
            }
        }))
    );
}

export function computeScore(ratings: Array<number>, releaseDate: Date, isFree: boolean, isBoosted: boolean, verificationRatio?: number):
    { meanRating: number; totalRatings: number; value: number } {
    const totalRatings = _.sum(ratings);

    if (totalRatings === 0) {
        return { meanRating: 0, totalRatings: 0, value: 0 };
    }

    verificationRatio ??= 1;
    verificationRatio = verificationRatio * 0.9 + 0.1;

    const meanRating = getMeanRating(ratings);
    const elapsedDays = differenceInDays(Date.now(), releaseDate);
    const starsDivider = isFree ? 10 : 1;
    let value = Math.pow(meanRating, 2) * Math.sqrt(((totalRatings * verificationRatio) / starsDivider) / (elapsedDays + 30)) * 1000 + 1 / (elapsedDays + 30) + 1 || 0;

    if (isBoosted) {
        value *= 1.5;
    }

    return {
        meanRating,
        totalRatings,
        value
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
