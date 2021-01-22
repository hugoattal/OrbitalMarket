import ProductModel from "../model";

export async function updateScores() {
    const products = await ProductModel.aggregate([{
        $project: {
            releaseDate: true,
            ratings: true
        }
    }]);
    console.log(products);
}
