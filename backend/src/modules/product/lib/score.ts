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
                    "computed.score": computeScore(product.ratings, product.releaseDate, product.price.value === 0)
                }
            }
        })
        ));
}

export function computeScore(ratings: Array<number>, releaseDate: Date, isFree: boolean): {value: number, totalRatings: number, meanRating: number} {
    const totalRatings = _.sum(ratings);

    if (totalRatings === 0) {
        return { value: 0, totalRatings: 0, meanRating: 0 };
    }

    const meanRating = getMeanRating(ratings);
    const elapsedDays = differenceInDays(Date.now(), releaseDate);
    const starsDivider = isFree ? 10 : 1;
    const value = Math.pow(meanRating, 2) * Math.sqrt((totalRatings / starsDivider) / (elapsedDays + 30)) * 1000 + 1 / elapsedDays + 1;

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
