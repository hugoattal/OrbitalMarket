import ProductModel from "../model";

export async function computeRanking()
{
    const products = await ProductModel.find({
        '$project': {
            'releaseDate': true,
            'ratings': true,
            'category': true
        }
    });
    console.log(products);
}
