import ProductModel from "./model";
import { isValidObjectId } from "mongoose";
export { search } from "./search";

export * as utils from "./utils";


export async function getById(id: string) {
    if (isValidObjectId(id)) {
        const product = await ProductModel.findById(id);

        if (product) {
            return product;
        }
    }


    return ProductModel.findOne({ slug: id }).exec();

}

