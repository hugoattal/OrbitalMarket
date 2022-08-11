import ProductModel, { IProductDocument } from "./model";
import { isValidObjectId } from "mongoose";
export { search } from "./search";
export * as utils from "./utils";

export async function getById(id: string): Promise<IProductDocument | null> {
    if (isValidObjectId(id)) {
        const product = await ProductModel.findById(id).populate("owner");
        if (product) {
            return product;
        }
    }

    return ProductModel.findOne({ slug: id }).populate("owner").exec();
}

export async function listByIds(ids: Array<string>) {
    return ProductModel.find({ "_id": { $in: ids } });
}
